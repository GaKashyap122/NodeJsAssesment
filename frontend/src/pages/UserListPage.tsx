import { useUserList } from '../hooks/useUserList';
import { USER_LIST } from '../constants/ui';

export default function UserListPage() {
  const { users, meta, page, totalPages, loading, serverError, goNext, goPrev } = useUserList();

  return (
    <div className="users-container">
      <h1 className="page-heading">{USER_LIST.HEADING}</h1>

      {serverError && (
        <div className="alert" role="alert">
          {serverError}
        </div>
      )}

      <div className="users-table-wrap">
        {loading ? (
          <div className="spinner-wrap">
            <div className="spinner" role="status" aria-label={USER_LIST.LOADING_LABEL} />
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">{USER_LIST.EMPTY}</div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>{USER_LIST.COL_NUMBER}</th>
                  <th>{USER_LIST.COL_NAME}</th>
                  <th>{USER_LIST.COL_EMAIL}</th>
                  <th>{USER_LIST.COL_ROLE}</th>
                  <th>{USER_LIST.COL_JOINED}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id}>
                    <td>{(page - 1) * 10 + idx + 1}</td>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-${user.role}`}>{user.role}</span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <span>
                Page {page} of {totalPages} &mdash; {meta?.total ?? 0} total users
              </span>
              <div className="pagination-btns">
                <button
                  type="button"
                  className="page-btn"
                  onClick={goPrev}
                  disabled={page <= 1}
                  aria-label={USER_LIST.PREV_LABEL}
                >
                  {USER_LIST.PREV}
                </button>
                <button
                  type="button"
                  className="page-btn"
                  onClick={goNext}
                  disabled={page >= totalPages}
                  aria-label={USER_LIST.NEXT_LABEL}
                >
                  {USER_LIST.NEXT}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
