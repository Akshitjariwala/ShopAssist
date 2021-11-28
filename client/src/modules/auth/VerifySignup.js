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
import Loading from "components/Loading";
import { config } from "common/config";
import { isEmpty } from "lodash";

const { Title } = Typography;

function VerifySignup() {
  const {
    state: { authenticated },
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState({});
  const { push, location } = useHistory();
  const onFinish = async (values) => {
    const { verificationCode } = values;
    if (
      verificationCode.toLowerCase() === emailVerificationCode.verificationCode
    ) {
      const { userDetails } = location.state;
      const username = userDetails.username;
      const { verificationCode } = values;
      if (isEmpty(location.state.userDetails)) {
        push(ROUTES.LOGIN);
      } else {
        try {
          const userData = {
            username,
            email: userDetails.email,
            userSub: userDetails.userSub,
            verificationCode,
          };
          const response = await api.post(
            `${config.CLOUD_FUNCTION_URL}/users`,
            userData
          );
          const { data } = response;
          if (data.uid && !isEmpty(data.uid)) {
            push(ROUTES.LOGIN);
          }
        } catch (err) {
          console.log(err);
          toast({
            message: err.message,
            type: "error",
          });
        }
      }
    } else {
      toast({
        message: "Please enter correct answer!",
        type: "error",
      });
    }
  };

  const fetchSecurityCode = async () => {
    setLoading(true);
    if (isEmpty(location.state.userDetails)) {
      push(ROUTES.LOGIN);
    } else {
      const { uid, role } = location.state.userDetails;
      try {
        const response = await api.post(
          "https://xhdt9h76vl.execute-api.us-east-1.amazonaws.com/Test/security-questions",
          { uid, role }
        );
        setEmailVerificationCode(response.data);
      } catch (error) {
        toast({
          message: "Something went wrong",
          type: "error",
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    if (authenticated) {
      if (mounted) {
        push("/");
      }
    }
    fetchSecurityCode();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line
  }, [authenticated]);

  if (loading) return <Loading />;
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
