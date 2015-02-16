<?php

class CLIQueryController extends CLIApplicationController {
  /** @override */
  public /*int*/ function main(/*array<string>*/ $args) {
    ini_set('memory_limit','256M');
    ini_set('max_execution_time','0');
    ini_set('max_input_time','0');

    if (count($args) < 2) {
      printf("[MySQL]\r\n");
      printf("You may type raw queries to execute them within the application's context.\r\n");
      printf("Press Ctrl+C to quit.\r\n");
      while (true) {
        printf("mysql> ");
        $confirm = fgets(STDIN);
        $this->execute($confirm);
      }
    } else {
      $this->execute($args[1]);
    }
  }

  public /*void*/ function execute(/*string*/ $query) {
    $query = trim($query);
    if (strlen($query) == 0)
      return;

    printf("\r\n");
    $result = null;
    try {
      $result = $this->database->prepare($query)->execute();

      if ($result->size > 0) {
        printf(CLIUtilities::table($result->rows));
      }

      if ($result->insertId != 0) {
        printf("Inserted record with primary key %d\r\n", $result->insertId);
      }

      printf("\r\n");

      printf("Time: %dms\r\n", $result->time);
      printf("Rows Affected: %d\r\n", $result->affected);
      printf("\r\n");
    } catch (DatabaseException $e) {
      printf("%s\r\n\r\n", $e->getError());
    }
  }
}
