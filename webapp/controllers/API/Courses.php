<?php

class Courses extends Controller
{
	/**
	 * Returns a list of all courses in the database for a given year and term.
	 * Year and term are specified as GET parameters.
	 */
	public function get()
	{
		$query = "
			SELECT `courseid`, `title`, `subject`, `course_number`,
			(%s) as `relevance`
			FROM `courses`
			WHERE `year` = :year AND `term` = :term
			AND (%s) > 0
			ORDER BY `relevance` DESC;
			";

		$parameters = array(
			'year' => (isset($this->request->get['year']) ? $this->request->get['year'] : date('Y')),
			'term' => (isset($this->request->get['term']) ? $this->request->get['term'] : $this->get_current_term())
		);

		$where = array();

		// Keyword Searching
		if(isset($this->request->get['search'])) {
			$terms = explode(" ", $this->request->get['search']);
			$tid = 0;

			foreach($terms as $term) {
				if(strlen($term) < 2)
					continue;

				$term = str_replace("%", "", $term);

				// Title
				$where[] = "`title` LIKE :searchx".$tid;

				// CRN
				if(strlen($term) == 5 && is_numeric($term))
					$where[] = "`crn` = :search".$tid;

				// Subject
				if(strlen($term) == 4)
					$where[] = "`subject` LIKE :search".$tid;

				// Course Number
				if(strlen($term) == 3 && is_numeric($term))
					$where[] = "`course_number` = :search".$tid;

				// Instructor
				$where[] = "`courseid` IN (
						SELECT `courseid`
						FROM `course_instructors`
						JOIN `instructors`
						ON `instructors`.`instructorid` = `course_instructors`.`instructorid`
						WHERE `instructors`.`name` LIKE :searchx".$tid."
					)";


				$parameters[':searchx'.$tid] = "%".$term."%";
				$parameters[':search'.$tid] = $term;
				$tid++;
			}
		}

		$wheres = "";
		foreach($where as $clause)
			$wheres .= " + (".$clause.")\n";
		$wheres = substr($wheres, 2);

		$query = sprintf($query, $wheres, $wheres);

		// Distribution Group (D1, D2, D3, LPAP)
		// Department
		// School
		// Credit Hours
		// Times/Days (maybe like whentomeet?)
		
		//$this->response->headers['Content-Type'] = 'text/plain';
		//echo "\n\n";
		//var_dump($query);
		//var_dump($parameters);
		//return;
		$result = $this->db->prepare($query)->execute($parameters);
		//var_dump($result->rows);
		$this->response->json($result->rows);
	}

	protected function get_current_term()
	{
		$month = (int) date('n');

		if($month <= 4)
			return 1; // Spring
		if($month <= 7)
			return 2; // Summer

		return 0; // Fall
	}
}