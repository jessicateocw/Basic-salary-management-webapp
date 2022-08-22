import { UploadOutlined } from "@ant-design/icons";
import { Space, Button, message, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import Papa from "papaparse";
import React, { useState } from "react";

export const FileUploadPage = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [uploading, setUploading] = useState(false);
  const [fileData, setFileData] = useState<any>([]);
  const readCSV = (file: any) => {
    Papa.parse(file, {
      complete: function (results) {
        console.log("reading:", results.data);
        const data: any[] = results.data;
        //map to remove #lines
        data.forEach((row) => {
          if (row.length > 0) {
            row.filter((col: any) => col.charAt() !== "#");
          }
        });
        setFileData(data);
      },
    });
  };

  const handleUpload = () => {
    //const formData = new FormData();
    fileList.forEach((file) => {
      readCSV(file);
      console.log("filecontent", file);
    });
    setUploading(true);
    // You can use any AJAX library you like
    fetch("https://nphc-hr.free.beeceptor.com/employees/upload", {
      method: "POST",
      body: fileData,
    })
      .then((res) => res.json())
      .then(() => {
        setFileList([]);
        message.success("upload successfully.");
      })
      .catch(() => {
        message.error("upload failed.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props: UploadProps = {
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      if (
        file.type.match(".csv") ||
        file.type.match("application/vnd.ms-excel") ||
        file.type.match(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      ) {
        setFileList([...fileList, file]);
      }

      return false;
    },
    fileList,
  };

  return (
    <Space>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>IMPORT CSV</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? "Uploading" : "Start Upload"}
      </Button>
    </Space>
  );
};
