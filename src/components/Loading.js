//! Ant Imports

import Spin from "antd/lib/spin";

//! Ant Icons

import LoadingOutlined from "@ant-design/icons/LoadingOutlined";

function Loading() {
  const loadingIcon = <LoadingOutlined spin />;
  return (
    <div className="cb-loading-wrapper">
      <Spin size="large" indicator={loadingIcon} />
    </div>
  );
}

export default Loading;
