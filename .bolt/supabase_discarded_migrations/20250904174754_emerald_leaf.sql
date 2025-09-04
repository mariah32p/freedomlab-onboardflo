/*
  # Update completed session status retroactively

  1. Problem
    - Sessions that are 100% complete still show as 'pending' or 'started'
    - The completion status was never properly updated in existing data

  2. Solution
    - Find all sessions where all required steps are completed
    - Update their submission_status to 'completed'
    - Set completed_at timestamp if not already set

  3. Logic
    - Count total required steps per checklist
    - Count completed steps per session
    - Update sessions where completed = total required steps
*/

-- Update sessions that have completed all required steps but aren't marked as completed
UPDATE customer_sessions 
SET 
  submission_status = 'completed',
  completed_at = COALESCE(completed_at, last_activity),
  updated_at = now()
WHERE id IN (
  -- Find sessions where all required steps are completed
  SELECT DISTINCT cs.id
  FROM customer_sessions cs
  JOIN checklists c ON cs.checklist_id = c.id
  WHERE cs.submission_status != 'completed'
    AND (
      -- Get count of required steps for this checklist
      SELECT COUNT(*)
      FROM checklist_steps steps
      WHERE steps.checklist_id = c.id 
        AND steps.is_required = true
    ) = (
      -- Get count of completed required steps for this session
      SELECT COUNT(*)
      FROM session_progress sp
      JOIN checklist_steps steps ON sp.step_id = steps.id
      WHERE sp.session_id = cs.id
        AND steps.is_required = true
    )
    AND (
      -- Only update if there are actually required steps to complete
      SELECT COUNT(*)
      FROM checklist_steps steps
      WHERE steps.checklist_id = c.id 
        AND steps.is_required = true
    ) > 0
);

-- Also handle edge case where checklists have no required steps but all steps are completed
UPDATE customer_sessions 
SET 
  submission_status = 'completed',
  completed_at = COALESCE(completed_at, last_activity),
  updated_at = now()
WHERE id IN (
  SELECT DISTINCT cs.id
  FROM customer_sessions cs
  JOIN checklists c ON cs.checklist_id = c.id
  WHERE cs.submission_status != 'completed'
    AND (
      -- Checklist has no required steps
      SELECT COUNT(*)
      FROM checklist_steps steps
      WHERE steps.checklist_id = c.id 
        AND steps.is_required = true
    ) = 0
    AND (
      -- But all steps are completed
      SELECT COUNT(*)
      FROM checklist_steps steps
      WHERE steps.checklist_id = c.id
    ) = (
      SELECT COUNT(*)
      FROM session_progress sp
      JOIN checklist_steps steps ON sp.step_id = steps.id
      WHERE sp.session_id = cs.id
    )
    AND (
      -- Only if there are actually steps to complete
      SELECT COUNT(*)
      FROM checklist_steps steps
      WHERE steps.checklist_id = c.id
    ) > 0
);