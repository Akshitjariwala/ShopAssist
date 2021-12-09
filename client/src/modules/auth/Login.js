import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";

//! Ant Imports

import { Form, Input, Button, Typography } from "antd";

//! Ant Icons

import { MailOutlined, LockOutlined } from "@ant-design/icons";

//! User Files

import { toast } from "common/utils";
import { AppContext } from "AppContext";
import * as ActionTypes from "common/actionTypes";
import { ROUTES } from "common/constants";
import api from "common/api";
import { config } from "common/config";

const { Title } = Typography;

function Login() {
  const {
    state: { authenticated },
    dispatch,
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const { push } = useHistory();
  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const response = await api.post(`${config.SERVER_URL}/login`, {
        email,
        password,
      });
      const { data } = response;
      if (data.status === "success") {
        const {
          result: { accessToken, idToken },
        } = data;
        const decoded = jwtDecode(idToken);
        const currentUser = {
          email,
          userId: decoded["cognito:username"],
          name: decoded.name,
          emailVerified: decoded.email_verified,
          idToken,
          accessToken,
        };
        dispatch({ type: ActionTypes.SET_ID_TOKEN, data: idToken });
        dispatch({ type: ActionTypes.SET_ACCESS_TOKEN, data: accessToken });
        dispatch({ type: ActionTypes.SET_CURRENT_USER, data: currentUser });
        dispatch({
          type: ActionTypes.SET_USER_ID,
          data: decoded["cognito:username"],
        });
        dispatch({ type: ActionTypes.SET_AUTHENTICATED, data: true });
        push(ROUTES.MAIN);
      } else if (
        data.status === "failure" &&
        data.error.name === "UserNotConfirmedException"
      ) {
        const userDetails = {
          email,
        };
        push(ROUTES.RESEND_CODE, { userDetails });
      } else {
        toast({
          message: "Email or password is wrong",
          type: "error",
        });
      }
    } catch (err) {
      toast({
        message: err.message,
        type: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      push("/");
    }
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
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid a email!",
            },
            { required: true, message: "Please enter your email" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          <div className="user-actions">
            <Link to={ROUTES.FORGET_PASSWORD}>Forget Password?</Link>
            <Link to={ROUTES.REGISTER}>Register Now!</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
