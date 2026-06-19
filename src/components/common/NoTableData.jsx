import React from 'react';
import noImgpic from '../../assets/images/no-data.svg';

function NoTableData({ columns, noColspan, noBody }) {
  const content = (
    <div className="no-data">
      <div className="no-data-content">
        <div className="no-data-img">
          <img src={noImgpic} alt="no-data" />
        </div>
        <div className="no-data-txt">NO DATA FOUND..!</div>
      </div>
    </div>
  );

  if (noBody) {
    return content;
  }

  return (
    <tbody>
      <tr>
        <td colSpan={noColspan ? undefined : columns?.length || 6}>
          {content}
        </td>
      </tr>
    </tbody>
  );
}

export default NoTableData;
