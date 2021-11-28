import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

//! Ant Imports

import { Form, Input, Button, Typography } from "antd";

//! Ant Icons

import { LockOutlined } from "@ant-design/icons";

//! User Files

import { toast } from "common/utils";
import { AppContext } from "AppContext";
import { ROUTES } from "common/constants";
import api from "common/api";
import { config } from "common/config";
import { isEmpty } from "lodash";

const { Title } = Typography;

function VerifySignup() {
  const {
    state: { authenticated },
  } = useContext(AppContext);
  const { push, location } = useHistory();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { verificationCode } = values;
    const { name: username, email, userSub } = location.state.userDetails;
    try {
      if (isEmpty(location.state.userDetails)) {
        push(ROUTES.LOGIN);
      }
      setLoading(true);
      const response = await api.post(`${config.SERVER_URL}/signUpVerify`, {
        username,
        email,
        userSub,
        verificationCode,
      });
      const { data } = response;
      if (data.status === "success") {
        push(ROUTES.LOGIN);
      } else {
        toast({
          message: "Security code is wrong or may be expired",
          type: "error",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        message: err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (authenticated) {
      if (mounted) {
        push("/");
      }
    }
    if (isEmpty(location.state.userDetails)) {
      push(ROUTES.LOGIN);
    }
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line
  }, [authenticated]);

  return (
    <div className="login">
      <Title level={3} className="sdp-text-strong">
        SHOP ASSIST
      </Title>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="verificationCode"
          rules={[
            { required: true, message: "Please enter verification code" },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Security Code"
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Confirm
          </Button>
          <div className="user-actions">
            <div />
            <Link to={ROUTES.LOGIN}>Already a user? Login</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default VerifySignup;
