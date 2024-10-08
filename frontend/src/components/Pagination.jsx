// CustomPagination.jsx
import React from 'react';
import { Pagination } from 'antd';

const CustomPagination = ({ current, pageSize, total, onPageChange }) => {
    return (
        <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            style={{ marginTop: '20px', textAlign: 'center' }}
        />
    );
};

export default CustomPagination;
