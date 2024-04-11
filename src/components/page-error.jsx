export function NotFound(){
  return (
      <div className="page-container">
        <h1 className="theme text-color">404 - Page Not Found</h1>
        <p className="theme text-color">Sorry, the page you are looking for does not exist.</p>
      </div>
  );
};

export function NoPermission(){
  return (
      <div className="page-container">
        <h1 className="theme text-color">You don't have permission to view this page</h1>
        <p className="theme text-color">Sorry, the page you are looking for contains private information of the other user. You're not allow to see this information</p>
      </div>
  );
}
