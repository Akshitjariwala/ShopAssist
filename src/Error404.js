import { Link } from "react-router-dom";

//! Ant Imports

import Result from "antd/lib/result";
import Button from "antd/lib/button";

const Error404 = () => (
  <Result
    className="hb-404"
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist or you do not have privilege to access this page."
    extra={
      <Button type="primary">
        <Link to="/">Back Home</Link>
      </Button>
    }
  />
);

export default Error404;
