<?php
/**
 * Food Autocomplete Lookup
 *
 * Accepts a CSV list of one or more user-entered food terms through a URL
 * query parameter.
 *
 * For each term, this script searches `samples/definitions-food.json` and
 * compares the input against each object's `name` key/value.
 *
 * A single input term may match and return multiple autocomplete entries.
 * Results from all input terms are combined into one flat list.
 *
 * Output:
 *   A flat CSV containing all matching autocomplete entries.
 *
 * Example:
 *   Input:  ?foods=oatmeal,milk
 *   Output: oatmeal 1 cup,oatmeal 1/2 cup,milk 1 cup,milk 8 oz
 *
 * IMPORTANT:
 *   This file is NOT used by the app's built-in food autocomplete system.
 *   The app has a separate mechanism for suggesting food entries while the
 *   user is partially typing a food name.
 *
 *   `autosuggest.php` is intended as an external interface when the project
 *   is hosted online. Its URL can be provided to ChatGPT, another AI service,
 *   or a third-party application so they can submit food terms and retrieve
 *   autocomplete entries from `definitions-food.json`.
 */

// Headers for CORS and CSV output
if (!headers_sent()) {
    header('Content-Type: text/plain; charset=UTF-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Support foods parameter via GET or POST (e.g. ?foods=oatmeal,milk or ?q=...)
$queryParam = $_GET['foods'] ?? $_GET['q'] ?? $_GET['food'] ?? $_POST['foods'] ?? $_POST['q'] ?? '';

if (is_array($queryParam)) {
    $rawTerms = $queryParam;
} else {
    $rawTerms = explode(',', (string)$queryParam);
}

// Clean and filter terms
$terms = [];
foreach ($rawTerms as $t) {
    $clean = trim((string)$t);
    if ($clean !== '') {
        $terms[] = $clean;
    }
}

if (empty($terms)) {
    echo '';
    exit(0);
}

$jsonPath = __DIR__ . '/samples/definitions-food.json';
if (!file_exists($jsonPath)) {
    http_response_code(500);
    echo "Error: Food definitions file not found.\n";
    exit(1);
}

$jsonContent = file_get_contents($jsonPath);
$foods = json_decode($jsonContent, true);

if (!is_array($foods)) {
    http_response_code(500);
    echo "Error: Invalid food definitions data.\n";
    exit(1);
}

// Collect unique food names preserving file order
$foodNames = [];
$seenNames = [];
foreach ($foods as $item) {
    if (isset($item['name']) && is_string($item['name'])) {
        $name = trim($item['name']);
        if ($name !== '' && !isset($seenNames[$name])) {
            $seenNames[$name] = true;
            $foodNames[] = $name;
        }
    }
}

/**
 * Finds matching food names for a given search query.
 *
 * Matching logic:
 * 1. Exact match (case-insensitive) - Score 0
 * 2. Prefix match (name starts with query) - Score 1
 * 3. Word-boundary match (query starts at beginning of a word) - Score 2
 * 4. Substring match - Score 3
 * 5. All tokens present in the name - Score 4
 *
 * @param string $query
 * @param array $names
 * @return array List of matching names sorted by relevance
 */
function findMatches(string $query, array $names): array {
    $q = trim($query);
    if ($q === '') {
        return [];
    }

    $ql = mb_strtolower($q, 'UTF-8');
    $tokens = preg_split('/\s+/', $ql, -1, PREG_SPLIT_NO_EMPTY);
    $matches = [];

    foreach ($names as $idx => $name) {
        $nl = mb_strtolower($name, 'UTF-8');

        $score = null;

        if ($nl === $ql) {
            $score = 0;
        } elseif (mb_strpos($nl, $ql) === 0) {
            $score = 1;
        } else {
            // Word-boundary match check
            $pattern = '/\b' . preg_quote($ql, '/') . '/iu';
            if (@preg_match($pattern, $nl)) {
                $score = 2;
            } elseif (mb_strpos($nl, $ql) !== false) {
                $score = 3;
            } elseif (count($tokens) > 1) {
                // Multi-token match check: all tokens must be present
                $allFound = true;
                foreach ($tokens as $token) {
                    if (mb_strpos($nl, $token) === false) {
                        $allFound = false;
                        break;
                    }
                }
                if ($allFound) {
                    $score = 4;
                }
            }
        }

        if ($score !== null) {
            $matches[] = [
                'name' => $name,
                'score' => $score,
                'len' => mb_strlen($name, 'UTF-8'),
                'order' => $idx,
            ];
        }
    }

    // Sort by:
    // 1. Relevance score (lower is better)
    // 2. Length of name (shorter names often closer to core item)
    // 3. Original file order
    usort($matches, function ($a, $b) {
        if ($a['score'] !== $b['score']) {
            return $a['score'] <=> $b['score'];
        }
        if ($a['len'] !== $b['len']) {
            return $a['len'] <=> $b['len'];
        }
        return $a['order'] <=> $b['order'];
    });

    return array_column($matches, 'name');
}

// For each term, find matches and combine into one flat list
$allMatches = [];
$matchedSet = [];

foreach ($terms as $term) {
    $termMatches = findMatches($term, $foodNames);
    foreach ($termMatches as $match) {
        if (!isset($matchedSet[$match])) {
            $matchedSet[$match] = true;
            $allMatches[] = $match;
        }
    }
}

// Output flat CSV format: entry1,entry2,entry3...
// Values containing commas or quotes are properly escaped per CSV rules
$outputStream = fopen('php://temp', 'r+');
if ($outputStream !== false) {
    fputcsv($outputStream, $allMatches, ',', '"', '\\');
    rewind($outputStream);
    $csvOutput = stream_get_contents($outputStream);
    fclose($outputStream);
    echo trim($csvOutput, "\r\n");
} else {
    // Fallback if temp stream fails
    $escaped = array_map(function ($val) {
        if (strpos($val, ',') !== false || strpos($val, '"') !== false || strpos($val, "\n") !== false) {
            return '"' . str_replace('"', '""', $val) . '"';
        }
        return $val;
    }, $allMatches);
    echo implode(',', $escaped);
}


