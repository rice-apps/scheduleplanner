<?php

class Schools extends Controller
{
	/**
	 * Return a list of all departments.
	 */
	public function get()
	{
		$result = Cache::remember('api_schools', function(){
			$query = $this->db->query("SELECT DISTINCT `school` FROM `courses`;");
			return $query->rows;
		});
		
		$this->response->json($result);
	}
}