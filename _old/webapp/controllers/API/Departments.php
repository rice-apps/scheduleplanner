<?php

class Departments extends Controller
{
	/**
	 * Return a list of all departments.
	 */
	public function get()
	{
		$result = Cache::remember('api_departments', function(){
			$query = $this->db->query("SELECT DISTINCT `department` FROM `courses`;");
			return $query->rows;
		});
		
		$this->response->json($result);
	}
}