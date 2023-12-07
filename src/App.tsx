import { Button, Card, Col, Popconfirm, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CollectionCreateForm from "./CollectionCreateForm";
import "./Style.scss";

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
  const [editItem, setEditItem] = useState<Item | null>(null);

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

  // Handle delete action
  const handleDelete = (id: number) => {
    axios
      .delete(`http://127.0.0.1:8000/api/posts/${id}`)
      .then((response) => {
        const updatedDataSource = dataSource.filter((item) => item.id !== id);
        setDataSource(updatedDataSource);
        message.success("Post deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        message.error("Failed to delete post");
      });
  };

  // Handle edit action
  const handleEdit = (record: Item) => {
    setEditItem(record);
    setIsModalVisible(true);
  };

  // Handle modal visibility
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditItem(null);
  };
  const openModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal form submit
  const handleModalCreate = (values: any) => {
    setIsModalVisible(false);
    if (editItem) {
      // If editItem is present, it means we are editing an existing post
      axios
        .put(`http://127.0.0.1:8000/api/posts/${editItem.id}`, values)
        .then((response) => {
          const updatedDataSource = dataSource.map((item) =>
            item.id === editItem.id ? { ...item, ...values } : item
          );
          setDataSource(updatedDataSource);
          message.success("Post updated successfully");
        })
        .catch((error) => {
          console.error("Error updating post:", error);
          message.error("Failed to update post");
        });
    } else {
      // If editItem is not present, it means we are creating a new post
      axios
        .post("http://127.0.0.1:8000/api/posts", values)
        .then((response) => {
          const newPost = {
            id: response.data.id,
            title: response.data.title,
            tags: response.data.tags,
            description: response.data.description,
          };
          setDataSource((prevDataSource) => [...prevDataSource, newPost]);
          message.success("Post created successfully");
        })
        .catch((error) => {
          console.error("Error creating post:", error);
          message.error("Failed to create post");
        });
    }
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
        <div className="Button">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this post?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Col className="cardStyle" span={12}>
      <Card>
        <div>
          <CollectionCreateForm
            openModal={openModal}
            visible={isModalVisible}
            onCreate={handleModalCreate}
            onCancel={handleModalClose}
            editItem={editItem}
          />
          <Table bordered dataSource={dataSource} columns={columns} loading={loading} />
        </div>
      </Card>
    </Col>
  );
};

export default App;
