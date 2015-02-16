<?php

class SQLImport {
   public static function import(File $file) {
      ini_set('memory_limit', '5120M');
      set_time_limit (0);

      $sql_query = $file->content;
      $sql_query = static::strip_remarks($sql_query);
      $sql_query = static::strip_comments($sql_query);
      dd($sql_query);
      $sql_query = static::split_sql_file($sql_query, ';');

      $i = 1;

      foreach ($sql_query as $sql) {
         echo $i++;
         echo PHP_EOL;
         App::getDatabase()->query($sql);
      }
   }

   public static function strip_comments(&$output) {
      $lines = explode("\n", $output);
      $output = "";

      $linecount = count($lines);

      $in_comment = false;
      for ($i = 0; $i < $linecount; $i++) {
         if (preg_match("/^\/\*/", preg_quote($lines[$i]))) {
            $in_comment = true;
         }

         if(!$in_comment) {
            $output .= $lines[$i] . "\n";
         }

         if(preg_match("/\*\/$/", preg_quote($lines[$i]))) {
            $in_comment = false;
         }
      }

      unset($lines);
      return $output;
   }

   public static function split_sql_file($sql, $delimiter) {
      $tokens = explode($delimiter, $sql);

      $sql = "";
      $output = array();

      $matches = array();

      $token_count = count($tokens);
      for ($i = 0; $i < $token_count; $i++) {
         if (($i != ($token_count - 1)) || (strlen($tokens[$i] > 0))) {
            $total_quotes = preg_match_all("/'/", $tokens[$i], $matches);
            $escaped_quotes = preg_match_all("/(?<!\\\\)(\\\\\\\\)*\\\\'/", $tokens[$i], $matches);

            $unescaped_quotes = $total_quotes - $escaped_quotes;

            if (($unescaped_quotes % 2) == 0) {
               $output[] = $tokens[$i];
               $tokens[$i] = "";
            } else {
               $temp = $tokens[$i] . $delimiter;
               $tokens[$i] = "";

               $complete_stmt = false;

               for ($j = $i + 1; (!$complete_stmt && ($j < $token_count)); $j++) {
                  $total_quotes = preg_match_all("/'/", $tokens[$j], $matches);
                  $escaped_quotes = preg_match_all("/(?<!\\\\)(\\\\\\\\)*\\\\'/", $tokens[$j], $matches);

                  $unescaped_quotes = $total_quotes - $escaped_quotes;

                  if (($unescaped_quotes % 2) == 1) {
                     $output[] = $temp . $tokens[$j];
                     $tokens[$j] = "";
                     $temp = "";
                     $complete_stmt = true;
                     $i = $j;
                  } else {
                     $temp .= $tokens[$j] . $delimiter;
                     $tokens[$j] = "";
                  }
               } // for
            } // else
         }
      }

      return $output;
   }


   public static function strip_remarks($sql) {
      $lines = explode("\n", $sql);

      $sql = "";

      $linecount = count($lines);
      $output = "";

      for ($i = 0; $i < $linecount; $i++) {
         if (($i != ($linecount - 1)) || (strlen($lines[$i]) > 0)) {
            if (isset($lines[$i][0]) && $lines[$i][0] != "#") {
               $output .= $lines[$i] . "\n";
            } else {
               $output .= "\n";
            }
            $lines[$i] = "";
         }
      }

      return $output;
   }
}
