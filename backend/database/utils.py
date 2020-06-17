def pr_json_create(pr):
  return {
            "title": pr.title, 
            "description": pr.body,
            "status": pr.state, 
            "number": pr.number, 
            "pr_id": pr.id
         }