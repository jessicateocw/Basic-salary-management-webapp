import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  TableProps,
} from "antd";
import axios from "axios";
import { getUsers } from "../util/endpoints";

interface DataType {
  id: string;
  login: string;
  name: string;
  salary: number;
}

export const UsersList = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 50,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selected, setSelected] = useState<any>({});

  const [editData, setEditData] = useState<any>({});

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    //console.log(editData);
    if (editData) {
      const updatedArray = data.map((obj: any) => {
        if (editData.id == obj.id) {
          return editData;
        }
        return obj;
      });

      setData(updatedArray);
    }

    //PUT /employees/:id
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchData = (params: any) => {
    setLoading(true);
    //fetching had a issue
    //429 - Too Many Requests. Refer: https://beeceptor.com/pricing
    axios({
      method: "get",
      url: "https://finalspaceapi.com/api/v0/character/", //baseURL
    }).then(function (response: any) {
      //console.log(response);
      setLoading(false);
      setPagination({
        ...params.pagination,
        total: 50, // 200 is mock data, you should read it from server
        // total: data.totalCount,
      });

      setData(response.data);
    });

    // fetch("https://nphc-hr.free.beeceptor.com/emplyees")
    //   .then((res) => res.json())
    //   .then(({ results }) => {
    //     setData(results);
    //     setLoading(false);
    //     setPagination({
    //       ...params.pagination,
    //       total: 200, // 200 is mock data, you should read it from server
    //       // total: data.totalCount,
    //     });
    //   });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: true,
      width: "10%",
    },
    {
      title: "Login",
      dataIndex: "img_url",
      sorter: true,
      width: "30%",
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      width: "20%",
    },
    {
      title: "Salary",
      dataIndex: "abilities",
      render: (abilities: string | any[]) => `${abilities.length}`,
      sorter: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: { id: React.Key }) =>
        data.length >= 1 ? (
          <Space>
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleClickEdit(record.id)}
            />
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ) : null,
    },
  ];

  useEffect(() => {
    fetchData({
      pagination,
    });
  }, []);

  const handleClickEdit = (id: React.Key) => {
    const index = data.findIndex((item: DataType) => id === item.id);

    const currentSelect: any = data[index];

    let salary = 0;
    if (currentSelect.abilities.length > 0) {
      salary = currentSelect.abilities.length;
    }
    setSelected({ ...currentSelect, salary: salary });

    console.log(selected);
    showModal();
  };

  const handleDelete = (id: React.Key) => {
    const newData = data.filter((item: DataType) => item.id !== id);
    setData(newData);
    //DELETE /employees/:id
  };

  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    fetchData({
      sortField: sorter,
      sortOrder: sorter,
      pagination: pagination,
      ...filters,
    });
  };
  const onFormLayoutChange = (values: any) => {
    //console.log(values);
    const currentValue = values;
    const currentSelect = selected;
    if ("name" in currentValue) {
      currentSelect.name = currentValue.name;
    }
    if ("login" in currentValue) {
      currentSelect.login = currentValue.login;
    }
    console.log(currentSelect);
    setEditData(currentSelect);
  };

  return (
    <>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      <Modal
        title={"Edit Item " + selected.id}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {" "}
        <Form
          layout="vertical"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true, layout: "vertical" }}
          autoComplete="off"
          onValuesChange={onFormLayoutChange}
        >
          <Form.Item
            label={"Name: " + selected.name}
            name="name"
            rules={[{ message: "Change name!" }]}
          >
            <Input id="name" />
          </Form.Item>

          <Form.Item
            label={"Login: " + selected.img_url}
            name="login"
            rules={[{ message: "Change Here!" }]}
          >
            <Input id="login" />
          </Form.Item>
          <Form.Item
            label={"Salary: " + selected.salary}
            name="salary"
            rules={[{ message: "Change Here!" }]}
          >
            <Input id="salary" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
