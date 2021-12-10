import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

//! Ant Imports

import { Form, Input, Button, Typography } from "antd";

//! Ant Icons

import { LockOutlined, MailOutlined } from "@ant-design/icons";

//! User Files

import { toast } from "common/utils";
import { AppContext } from "AppContext";
import { ROUTES, REGEX } from "common/constants";
import api from "common/api";
import { config } from "common/config";

const { Title } = Typography;

function ResetPassword() {
  const {
    state: { authenticated },
  } = useContext(AppContext);
  const { push } = useHistory();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { email, verificationCode, password } = values;
    try {
      setLoading(true);
      const response = await api.post(`${config.SERVER_URL}/resetPassword`, {
        email,
        verificationCode,
        newPassword: password,
      });
      const { data } = response;
      if (data.status === "success") {
        toast({
          message: "Password changed successfully",
          type: "success",
        });
        setTimeout(() => {
          push(ROUTES.LOGIN);
        }, 2000);
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
            placeholder="New Password"
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
            placeholder="Confirm New Password"
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

export default ResetPassword;
