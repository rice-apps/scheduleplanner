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
			SELECT `courseid`, `title`, `subject`, `course_number`
			FROM `courses`
			WHERE `year` = :year AND `term` = :term
			;
			";

		$parameters = array(
			'year' => (isset($this->request->get['year']) ? $this->request->get['year'] : date('Y')),
			'term' => (isset($this->request->get['term']) ? $this->request->get['term'] : $this->get_current_term())
		);

		// Keyword Searching
		if(isset($this->request->get['search'])) {
			$terms = $this->request->get['search'];

			// Title
			// CRN
			// Subject | Subject + Course Number
			// Instructor
		}

		// Distribution Group (D1, D2, D3, LPAP)
		// Department
		// School
		// Credit Hours
		// Times/Days (maybe like whentomeet?)

		$result = $this->db->prepare($query)->execute($parameters);
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