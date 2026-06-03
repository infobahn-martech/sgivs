import * as XLSX from 'xlsx';
import visaApplicationService from '../../services/VisaApplicationService';
import useAlertReducer from '../../stores/AlertReducer';

export const exportComments = async (visa_application_id, fileName = 'Comments') => {
  try {
    const response = await visaApplicationService.getComments(visa_application_id);

    const comments = response?.data?.data || [];

    if (!comments.length) {
      const { error } = useAlertReducer.getState();
      error('No comments found');
      return;
    }

    const excelData = comments.map((item) => ({
      Comment: item.comment,
      'Comment By': `${item.first_name} ${item.last_name}`,
      'Comment Date': item.comment_at,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Comments');

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${fileName}.xlsx`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (err) {
    const { error } = useAlertReducer.getState();
    error(err?.response?.data?.message || 'Failed to export comments');
  }
};