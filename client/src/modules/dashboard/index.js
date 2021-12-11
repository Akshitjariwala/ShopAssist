import React, { useState, createElement, useContext } from "react";
import { useHistory } from "react-router-dom";

//! Ant Imports

import { Form, Input, Button, List, Space, Empty } from "antd";

//! Ant Icons

import {
  StarOutlined,
  DollarOutlined,
  CommentOutlined,
} from "@ant-design/icons";

//! User Files

import { toast } from "common/utils";
import api from "common/api";
import { config } from "common/config";
import { AppContext } from "AppContext";

function Dashboard() {
  const {
    state: { currentUser },
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const { push } = useHistory();

  const onFinish = async (values) => {
    const { product } = values;
    try {
      setLoading(true);
      const response = await api.post(`${config.SERVER_URL}/FetchProducts`, {
        product,
        userId: currentUser.email,
      });
      const { data } = response;
      setProductList([...data] || []);
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

  const handleProductClick = async (product) => {
    try {
      // eslint-disable-next-line
      // const result = await api.post(
      //   "https://qtx9upms37.execute-api.us-east-1.amazonaws.com/default/products",
      //   product
      // );
      push(`/product/${product.asin}`, { product });
    } catch (err) {
      console.log(err);
    }
  };

  const IconText = ({ icon, text }) => (
    <Space>
      {createElement(icon)}
      {text}
    </Space>
  );

  return (
    <div className="dashboard">
      <Form
        name="normal_login"
        className="product-search-form"
        initialValues={{ remember: true }}
        layout="inline"
        onFinish={onFinish}
      >
        <Form.Item
          name="product"
          className="searchbar"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input placeholder="Enter Product Name" />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            {loading ? "Searching" : "Search"}
          </Button>
        </Form.Item>
      </Form>
      {!loading && (
        <div>
          <List
            itemLayout="vertical"
            size="large"
            className="product-list"
            locale={{ emptyText: <Empty description="Search product" /> }}
            dataSource={productList}
            renderItem={(item) => (
              <List.Item
                key={item.asin}
                actions={[
                  <IconText
                    icon={StarOutlined}
                    text={item.overall_rating}
                    key="list-vertical-star-o"
                  />,
                  <IconText
                    icon={DollarOutlined}
                    text={item.price}
                    key="list-vertical-like-o"
                  />,
                  <IconText
                    icon={CommentOutlined}
                    text={item.reviews_count}
                    key="list-vertical-message"
                  />,
                ]}
                extra={<img height={150} alt="logo" src={item.thumbnail} />}
              >
                <List.Item.Meta
                  title={
                    <div
                      className="acc-div"
                      onClick={() => handleProductClick(item)}
                    >
                      {item.title}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
