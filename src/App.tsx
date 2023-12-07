import { Button, Card, Col, Popconfirm, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CollectionCreateForm from "./CollectionCreateForm";

interface Item {
  id: number;
  title: string;
  tags: string;
  description: string;
}

const App: React.FC = () => {
  const [dataSource, setDataSource] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    allPost();
  }, []);

  // Fetch all posts
  const allPost = () => {
    axios
      .get("http://127.0.0.1:8000/api/posts")
      .then((response) => {
        const dataFromApi: Item[] = response.data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          tags: item.tags,
          description: item.description,
        }));
        setDataSource(dataFromApi);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle delete action\
  const handleDelete = (id: number) => {
    axios
      .delete(`http://127.0.0.1:8000/api/posts/${id}`)
      .then((response) => {
        console.log("response");
        console.log(response.data);
        const updatedDataSource = dataSource.filter((item) => item.id !== id);
        setDataSource(updatedDataSource);
        message.success("Post deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        message.error("Failed to delete post");
      });
  };

  // Handle modal visibility
  const handleModalClose = () => {
    setIsModalVisible(false);
  };
  const openModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal form submit
  const handleModalCreate = (values: any) => {
    console.log("Received values of form: ", values);
    axios
      .post("http://127.0.0.1:8000/api/posts", values)
      .then((response) => {
        console.log(response.data);
        // Assuming the response contains the newly created post details
        const newPost = {
          id: response.data.id,
          title: response.data.title,
          tags: response.data.tags,
          description: response.data.description,
        };
        // Update the dataSource state with the new post
        setDataSource((prevDataSource) => [...prevDataSource, newPost]);
        message.success("Post created successfully");
        allPost();
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        message.error("Failed to create post");
      })
      .finally(() => {
        setIsModalVisible(false);
      });
  };

  //style
  const cardStyle: React.CSSProperties = {
    margin: "0 auto",
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: Item) => (
        <Popconfirm
          title="Are you sure you want to delete this post?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Col span={12} style={cardStyle}>
      <Card style={{ width: "100%" }}>
        <div>
          <CollectionCreateForm
            openModal={openModal}
            visible={isModalVisible}
            onCreate={handleModalCreate}
            onCancel={handleModalClose}
          />
          <Table bordered dataSource={dataSource} columns={columns} loading={loading} />
        </div>
      </Card>
    </Col>
  );
};

export default App;
