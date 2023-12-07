import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";

interface Values {
  id: number;
  title: string;
  tags: string;
  description: string;
}

interface CollectionCreateFormProps {
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  openModal: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  visible,
  onCreate,
  onCancel,
  openModal,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      console.log(setLoading);
      const values = await form.validateFields();
      form.resetFields();
      onCreate(values);
    } catch (errorInfo) {
      console.log("Validate Failed:", errorInfo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={openModal}>
        Add Post
      </Button>
      <Modal
        visible={visible}
        title="Create a new post"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        confirmLoading={loading}
        onOk={handleCreate}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title of collection!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tags"
            label="Tags"
            rules={[{ required: true, message: "Please input the tags of collection!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          {/*   <Form.Item name="modifier" className="collection-create-form_last-form-item">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};

export default CollectionCreateForm;
