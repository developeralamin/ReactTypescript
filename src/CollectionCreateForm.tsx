import { Button, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";

//alias for data type
interface Values {
  id?: number;
  title: string;
  tags: string;
  description: string;
}
//receive props
interface CollectionCreateFormProps {
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  openModal: () => void;
  editItem?: Values | null;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  visible,
  onCreate,
  onCancel,
  openModal,
  editItem,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editItem) {
      form.setFieldsValue({
        id: editItem.id,
        title: editItem.title,
        tags: editItem.tags,
        description: editItem.description,
      });
    } else {
      form.resetFields();
    }
  }, [editItem, form]);

  //create and loading for button
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
        title={editItem ? "Edit Item" : " Create Item"}
        okText={editItem ? "Update" : "Create"}
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
