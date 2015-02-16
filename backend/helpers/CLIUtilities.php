<?php


class CLIUtilities {
  const MIN_TABLE_COLUMN = 5;
  const MAX_TABLE_WIDTH = 80;

  public static function str_limit($value, $limit = 100, $end = '...')
  {
    if (strlen($value) <= $limit) return $value;
    return substr($value, 0, $limit - strlen($end)).$end;
  }


  public static /*string*/ function table(/*array<array<string, string>>*/ $data) {
    // Determine columns and width.
    $rows = sizeof($data);
    $columns = sizeof($data[0]);
    $column_widths = [];

    foreach($data as $row) {
      foreach($row as $column => $item) {
        if (!isset($column_widths[$column]))
          $column_widths[$column] = 0;

        $column_widths[$column] = min(max(strlen($column), strlen($item), $column_widths[$column]), 30);
      }
    }

    $column_width = array_sum($column_widths);
    $width = $column_width + 1 + 3 * $columns;

    // Build separator.
    $separator = "+";

    foreach($data[0] as $column => $item) {
      $separator .= str_repeat("-", $column_widths[$column] + 2) . '+';
    }

    $separator .= "\r\n";

    //$separator = "+" . str_repeat("-", $width - 2) . "+\r\n";


    // Print the header.

    $t = "";

    $t .= $separator;

    $t .= "| ";
    foreach($data[0] as $key => $_) {
      $key = CLIUtilities::str_limit($key, $column_widths[$key]);
      $t .= $key;
      $t .= str_repeat(" ", $column_widths[$key] - strlen($key));
      $t .= " | ";
    }

    $t = substr($t, 0, -1) . "\r\n";
    $t .= $separator;

    // Print the rows.
    foreach($data as $row) {
      $t .= "| ";
      foreach($row as $column => $text) {
        $text = CLIUtilities::str_limit($text, $column_widths[$column]);
        $t .= $text;
        $t .= str_repeat(" ", $column_widths[$column] - strlen($text));
        $t .= " | ";
      }

      $t = substr($t, 0, -1) . "\r\n";
      //$t .= $separator;
    }
    $t .= $separator;
    return $t;
  }
}
