import React from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface JobDetail {
  jobTitle: string;
  count: number;
}

interface DetailsTableProps {
  data: JobDetail[];
}

const DetailsTable: React.FC<DetailsTableProps> = ({ data }) => {
  const columns: ColumnsType<JobDetail> = [
    { title: 'Job Title', dataIndex: 'jobTitle', key: 'jobTitle' },
    { title: 'Count', dataIndex: 'count', key: 'count' },
  ];

  return <Table columns={columns} dataSource={data} rowKey="jobTitle" />;
};

export default DetailsTable;