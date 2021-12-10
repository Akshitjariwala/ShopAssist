import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { isEmpty } from "lodash";

//! Ant Imports

import { List, Button, Descriptions, Typography, Modal, Progress } from "antd";

//! User Files

// import { loadIntoDatabase, fetchSentiment } from "common/service";
import api from "common/api";
import { AppContext } from "AppContext";
import { ROUTES } from "common/constants";
import { toast } from "common/utils";

const { Title, Text } = Typography;

function ProductPage() {
  const {
    state: { userId },
  } = useContext(AppContext);
  const { push } = useHistory();
  const [productTitle, setProductTitle] = useState("");
  const [currentProduct, setCurrentProduct] = useState({});
  const { asin } = useParams();
  const location = useLocation();

  useEffect(() => {
    const product = location.state.product;
    if (isEmpty(product)) {
      push(ROUTES.MAIN);
    } else {
      setCurrentProduct(product);
      setProductTitle(product.title);
    }
    // eslint-disable-next-line
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const reviewAnalysis = async () => {
    const reviewAccessData = {
      asin,
      userID: currentProduct.userID,
    };
    console.log(reviewAccessData);
    try {
      api
        .post(
          "https://7jjweip03i.execute-api.us-east-1.amazonaws.com/default/reviewanalysis",
          reviewAccessData
        )
        .then((response) => {
          console.log(response.data);
          analysisFunc(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      toast({
        message: err.message,
        type: "error",
      });
    }
  };

  async function analysisFunc(reviewData) {
    api
      .post("http://localhost:8080/LoadDatabase", { data: reviewData })
      .then((response) => {
        console.log(response.data);
        api
          .post("http://localhost:8080/FetchSentiment", { data: response.data })
          .then((sentimentData) => {
            console.log(sentimentData);
            toast({
              message: `Sentiment review of this product: ${
                sentimentData?.data.Items[0].overallSentiment
                  ? sentimentData?.data.Items[0].overallSentiment
                  : "Unknown"
              }`,
              type: "info",
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
  }

  return (
    <div className="product-info">
      <Descriptions
        title={
          <div className="product-title">
            <Title level={4} className="sdp-text-strong acc-text">
              Product Info
            </Title>
            <div className="acc-btn">
              <Button type="primary" onClick={reviewAnalysis}>
                Review Analysis
              </Button>
              {/* <h4>{overallSentiment}</h4> */}
              <Button type="primary" onClick={showModal}>
                Rating Visualization
              </Button>
              <Modal
                title="Rating"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                {currentProduct?.stars_stat ? (
                  <Descriptions.Item
                    label={<Text className="sdp-text-strong">Ratings</Text>}
                    span={3}
                  >
                    {Object.values(currentProduct?.stars_stat).map(
                      (rating, i) => {
                        return (
                          <>
                            {i + 1}
                            <></>
                            <Progress
                              percent={rating.substr(0, rating.length - 1)}
                            />
                          </>
                        );
                      }
                    )}
                  </Descriptions.Item>
                ) : (
                  "No stats to show"
                )}
              </Modal>
            </div>
          </div>
        }
        bordered
      >
        <Descriptions.Item
          span={3}
          label={<Text className="sdp-text-strong">Product</Text>}
        >
          {productTitle}
        </Descriptions.Item>
        <Descriptions.Item
          label={<Text className="sdp-text-strong">ASIN</Text>}
          span={2}
        >
          {currentProduct?.asin}
        </Descriptions.Item>
        <Descriptions.Item
          label={<Text className="sdp-text-strong">Overall Rating</Text>}
        >
          {currentProduct?.overall_rating}
        </Descriptions.Item>
        <Descriptions.Item
          label={<Text className="sdp-text-strong">Price</Text>}
          span={2}
        >
          ${currentProduct?.price}
        </Descriptions.Item>
        <Descriptions.Item
          label={<Text className="sdp-text-strong">Total Reviews</Text>}
          span={3}
        >
          {currentProduct?.reviews_count}
        </Descriptions.Item>
        <Descriptions.Item
          label={<Text className="sdp-text-strong">Reviews</Text>}
          span={3}
        >
          <List
            size="large"
            bordered
            className="product-info"
            dataSource={currentProduct?.reviews}
            renderItem={(item) => {
              return <List.Item>{item}</List.Item>;
            }}
          />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default ProductPage;
