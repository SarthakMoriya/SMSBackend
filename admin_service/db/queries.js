export const selectCourseExamsQuery=()=>`select * from master.exams where course_id=? and semester=?;`
export const updateAccVerificationStatus=()=>`UPDATE studentdb.users SET admin_approved=?,active=1 WHERE id=?`
export const getUnApprovedAccs=()=>`SELECT id,name,email,created_at FROM studentdb.users WHERE admin_approved=0;`
export const deleteAccountQ=()=>`UPDATE studentdb.users SET active=0 WHERE id=?;`