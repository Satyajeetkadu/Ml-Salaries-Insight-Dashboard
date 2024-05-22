import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Papa, { ParseResult } from 'papaparse';
import JobsLineChart from './LineChart';
import DetailsTable from './DetailsTable';

interface SalaryData {
  work_year: string;
  experience_level: string;
  employment_type: string;
  job_title: string;
  salary: string;
  salary_currency: string;
  salary_in_usd: string;
  employee_residence: string;
  remote_ratio: string;
  company_location: string;
  company_size: string;
}

interface TableData {
  key: string;
  year: string;
  totalJobs: number;
  averageSalary: number;
}

interface JobDetail {
  jobTitle: string;
  count: number;
}

const SalaryTable: React.FC = () => {
  const [data, setData] = useState<TableData[]>([]);
  const [chartData, setChartData] = useState<TableData[]>([]);
  const [detailsData, setDetailsData] = useState<JobDetail[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  useEffect(() => {
    fetch('/salaries.csv')
      .then(response => response.text())
      .then(csv => {
        Papa.parse<SalaryData>(csv, {
          header: true,
          complete: (results: ParseResult<SalaryData>) => {
            const records = results.data;
            const groupedData = records.reduce((acc: Record<string, { year: string; totalJobs: number; totalSalary: number }>, record: SalaryData) => {
              const year = record.work_year;
              const salary = parseFloat(record.salary_in_usd);

              if (isNaN(salary) || !year) {
                console.warn('Skipping invalid record:', record);
                return acc;
              }

              if (!acc[year]) {
                acc[year] = { year, totalJobs: 0, totalSalary: 0 };
              }

              acc[year].totalJobs += 1;
              acc[year].totalSalary += salary;

              return acc;
            }, {});

            const tableData = Object.values(groupedData).map((item, index) => ({
              key: index.toString(),
              year: item.year,
              totalJobs: item.totalJobs,
              averageSalary: item.totalSalary / item.totalJobs,
            }));

            setData(tableData);
            setChartData(tableData);
          },
        });
      });
  }, []);

  const handleRowClick = (record: TableData) => {
    setSelectedYear(record.year);

    fetch('/salaries.csv')
      .then(response => response.text())
      .then(csv => {
        Papa.parse<SalaryData>(csv, {
          header: true,
          complete: (results: ParseResult<SalaryData>) => {
            const records = results.data.filter(r => r.work_year === record.year);
            const jobDetails = records.reduce((acc: Record<string, number>, record: SalaryData) => {
              const jobTitle = record.job_title;
              if (!acc[jobTitle]) {
                acc[jobTitle] = 0;
              }
              acc[jobTitle] += 1;
              return acc;
            }, {});

            const detailsTableData = Object.keys(jobDetails).map(jobTitle => ({
              jobTitle,
              count: jobDetails[jobTitle],
            }));

            setDetailsData(detailsTableData);
          },
        });
      });
  };

  const columns: ColumnsType<TableData> = [
    { title: 'Year', dataIndex: 'year', key: 'year', sorter: (a, b) => a.year.localeCompare(b.year) },
    { title: 'Total Jobs', dataIndex: 'totalJobs', key: 'totalJobs', sorter: (a, b) => a.totalJobs - b.totalJobs },
    { title: 'Average Salary (USD)', dataIndex: 'averageSalary', key: 'averageSalary', sorter: (a, b) => a.averageSalary - b.averageSalary },
  ];

  return (
    <div className="App-main">
      <div className="chart-container">
        <JobsLineChart data={chartData} />
      </div>
      <div className="ant-table-wrapper">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="key"
          pagination={false} // Disable pagination
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </div>
      {selectedYear && (
        <div className="details-table-container">
          <h2>Job Details for {selectedYear}</h2>
          <DetailsTable data={detailsData} />
        </div>
      )}
    </div>
  );
};

export default SalaryTable;
