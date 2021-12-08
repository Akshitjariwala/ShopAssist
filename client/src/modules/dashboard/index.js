import { useState, createElement } from "react";
import { useHistory } from "react-router-dom";
import React from 'react';

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

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const { push } = useHistory();

  const onFinish = async (values) => {
    const { product } = values;
    try {
      setLoading(true);
      const response = await api.post("http://localhost:8080/FetchProducts", {
        product,
      });
      const { data } = response;
      setProductList([...data, ...data, ...data] || []);
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
    api.post('https://qtx9upms37.execute-api.us-east-1.amazonaws.com/default/products',product).then((result) => {
    push(`/product/${product.asin}`, { product });
  });
    
  };

  const IconText = ({ icon, text }) => (
    <Space>
      {createElement(icon)}
      {text}
    </Space>
  );

  // const onProductClick = async (asinNumber) => {
  //   var productMetaData = {};
  //   // productList.map((product) => {
  //   //   if (product.asin === asinNumber) {
  //   //     // Add user email id as well from session to product review details.
  //   //     productMetaData["userID"] = "ironman12";
  //   //     productMetaData["asin"] = product.asin;
  //   //     productMetaData["price"] = product.price.toString();
  //   //     productMetaData["reviews_count"] = product.reviews_count.toString();
  //   //     productMetaData["overall_rating"] = product.overall_rating.toString();
  //   //     productMetaData["title"] = product.title;
  //   //     productMetaData["stars_stat"] = product.stars_stat;
  //   //     productMetaData["thumbnail"] = product.thumbnail;

  //   //     //const product_review_list = {}

  //   //     const product_review_list = {};

  //   //     const tempReviewResult = [
  //   //       "I like everything about it I had to switch back from android to iPhone so I heard the XR was good. I got this refurbished cause it’s cheap.The only thing I dislike no button but I’m getting used to not having a button.",
  //   //       "muy buen celular esta perfecto",
  //   //       "Worked good for me.",
  //   //       "It is too slick for my hand. I’ve dropped it at least four times. Thankfully it has not broken. I don’t think a glass back was a good idea. My finger aren’t very long.",
  //   //       "It arrived fast as you would expect from Amazon. The phone feels good holding it and it responds fast to the touch. So far I'm very happy with it.",
  //   //       "The phone was okay but then once you try to start it; it doesn’t work. The phone is obviously locked and it only works with certain carriers which the seller claims that it works with “all carriers”: FALSE! I have Brent dying to return it but Amazon staff have not be backing me up.",
  //   //       "No issue with product at all. Charger and cable were not stock but exceed expectations for perf and quality.",
  //   //       "I will update this as time goes on, but upon receiving my phone it seems nearly brand new.",
  //   //       "It’s perfect the battery last longer than expected can go almost two days with out charging it",
  //   //       "Received as listed great buy.",
  //   //     ];

  //   //     /*for (let i=0;i<product.reviews.length;i++){
  //   //         product_review_list[i] = product.reviews[i];
  //   //       }*/

  //   //     for (let i = 0; i < tempReviewResult.length; i++) {
  //   //       product_review_list[i] = tempReviewResult[i];
  //   //     }

  //   //     productMetaData["reviews"] = product_review_list;
  //   //   }
  //   // });

  //   api
  //     .post(
  //       "https://qtx9upms37.execute-api.us-east-1.amazonaws.com/default/products",
  //       productMetaData
  //     )
  //     .then((result) => {
  //       console.log(result.data);
  //       history.push({ pathname: ROUTES.PRODUCTPAGE, data: productMetaData });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

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
                extra={<img width={272} alt="logo" src={item.thumbnail} />}
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
