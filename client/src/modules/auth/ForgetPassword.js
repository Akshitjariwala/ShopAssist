import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

//! Ant Imports

import { Form, Input, Button, Typography } from "antd";

//! Ant Icons

import { MailOutlined } from "@ant-design/icons";

//! User Files

import { toast } from "common/utils";
import { AppContext } from "AppContext";
import { ROUTES } from "common/constants";
import api from "common/api";
import { config } from "common/config";

const { Title } = Typography;

function ForgetPassword() {
  const {
    state: { authenticated },
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const { push } = useHistory();
  const onFinish = async (values) => {
    const { email } = values;
    setLoading(true);
    try {
      const response = await api.post(`${config.SERVER_URL}/forgotPassword`, {
        email,
      });
      const { data } = response;
      if (data.status === "success") {
        toast({
          message: "Email sent successfully",
          type: "success",
        });
        setTimeout(() => {
          push(ROUTES.RESET_PASSWORD);
        }, 2000);
      } else {
        toast({
          message: "Something went wrong while serving your request",
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
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Send
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default ForgetPassword;
