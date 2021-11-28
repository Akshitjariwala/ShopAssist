import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

//! Ant Imports

import { Form, Input, Button, Typography } from "antd";

//! Ant Icons

import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";

//! User Files

import { toast } from "common/utils";
import { AppContext } from "AppContext";
import { REGEX, ROUTES } from "common/constants";
import api from "common/api";
import { config } from "common/config";
import { isEmpty } from "lodash";

const { Title } = Typography;

function Signup() {
  const {
    state: { authenticated },
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const { push } = useHistory();
  const onFinish = async (values) => {
    const { name, email, password } = values;
    setLoading(true);
    try {
      const userDetails = {
        name,
        email,
        password,
      };
      const response = await api.post(
        `${config.CLOUD_FUNCTION_URL}/users`,
        userDetails
      );
      const { data } = response;
      if (data.uid && !isEmpty(data.uid)) {
        push(ROUTES.VERIFY_SIGNUP, { userDetails });
      }
    } catch (err) {
      console.log(err);
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
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Name"
          />
        </Form.Item>
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
          rules={[
            { required: true, message: "Please enter your password!" },
            {
              pattern: REGEX.PASSWORD,
              message:
                "Password must contain combination of lowercase, uppercase, special characters",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Register
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

export default Signup;
