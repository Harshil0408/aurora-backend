const path = require('path');
const fs = require('fs');
const moment = require('moment');
const { logger } = require('../../utils/logger');
const { serviceToController } = require('../../helper/response.helper');

const insertDataFunction = async (insertData) => {
  try {
    const insertRecord = await insertData.Model.create(insertData.data);
    if (insertRecord === null) {
      return serviceToController(0, null, 'Data not inserted');
    } else {
      return serviceToController(1, insertRecord.dataValues, 'Data inserted successfully!');
    }
  } catch (error) {
    logger.error('======================== ERROR FROM INSERTDATAFUNCTION =======================');
    logger.error(error);
    return serviceToController(0, null, 'Internal server error');
  }
};

const updateDataFunction = async (updateData) => {
  try {
    const updateRecord = await updateData.Model.update(updateData.data, { where: updateData.condition });
    if (updateRecord[0] > 0) {
      return serviceToController(1, null, 'Data updated successfully!');
    } else {
      return serviceToController(0, null, 'No changes found');
    }
  } catch (error) {
    logger.error('======================== ERROR FROM updateDataFunction =======================');
    logger.error(error);
    return serviceToController(4, [], 'internal server error');
  }
};

const deleteDataFunction = async (deleteData) => {
  try {
    const deleteRecord = await deleteData.Model.destroy({ where: deleteData.condition });
    if (deleteRecord > 0) {
      return serviceToController(1, null, 'Data deleted successfully!');
    } else {
      return serviceToController(0, null, 'Something went wrong');
    }
  } catch (error) {
    logger.error('======================== ERROR FROM DELETEDATAFUNCTION =======================');
    logger.error(error);
    return serviceToController(4, [], 'internal server error');
  }
};

const checkExistsOrNotFunction = async (getSingleData) => {
  try {
    const getSingleRecord = await getSingleData.Model.findOne({ where: getSingleData.condition });

    if (getSingleRecord === null) {
      return serviceToController(0, null, 'Data not found');
    } else {
      return serviceToController(1, getSingleRecord, 'Data found successfully!');
    }
  } catch (error) {
    logger.error('======================== ERROR FROM checkExistOrNotFunction =======================');
    logger.error(error);
    return serviceToController(4, [], 'internal server error');
  }
};

const findOneSequelizeDataFunction = async (data) => {
  try {
    const getSingleRecord = await data.Model.findOne({ where: data.condition });

    if (getSingleRecord === null) {
      return serviceToController(0, null, 'Data not found');
    } else {
      return serviceToController(1, getSingleRecord, 'Data found successfully!');
    }
  } catch (error) {
    logger.error('======================== ERROR FROM findOneSequelizeDataFunction =======================');
    logger.error(error);
    return serviceToController(4, [], 'internal server error');
  }
};

const getDataFunction = async (getData) => {
  try {
    const getRecord = await getData.Model.findAll({ where: getData.condition });
    if (getRecord.length === 0) {
      return serviceToController(0, null, 'Data not found');
    } else {
      return serviceToController(1, getRecord, 'Data found successfully!');
    }
  } catch (error) {
    logger.error('======================== ERROR FROM GETDATAFUNCTION =======================');
    logger.error(error);
    return serviceToController(4, [], 'internal server error');
  }
};

const fileUploadFunction = async (fileUpload) => {
  try {
    const p = `../../public/assets/${fileUpload.path}`;
    const uploadDir = path.join(__dirname, p);
    if (fs.existsSync(uploadDir) === false) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const files = Array.isArray(fileUpload.files) ? fileUpload.files : [fileUpload.files];
    const FileDataResponseArr = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = moment().format('YYYYMMDDHHmmSS') + '_' + moment().millisecond() + '_' + file.name;

      file.mv(`${uploadDir}/${fileName}`, (err) => {
        if (err) {
          logger.error(err);
        }
      });
      FileDataResponseArr.push(fileName);
    }
    return serviceToController(1, FileDataResponseArr, 'Uploaded File Response');
  } catch (err) {
    logger.error('======================== ERROR FROM MULTIPLEFILEUPLOADFUNCTION =======================');
    logger.error(err);
    return serviceToController(4, [], 'internal server error');
  }
};

const unlinkFileFunction = async (unlinkFiles) => {
  try {
    const fileFolder = path.resolve(__dirname, `../../public/assets/`);
    const files = Array.isArray(unlinkFiles.files) ? unlinkFiles.files : [unlinkFiles.files];
    for (let i = 0; i < files.length; i++) {
      const filepath = path.resolve(fileFolder, unlinkFiles.path, files[i].url);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
  } catch (err) {
    logger.error('======================== ERROR FROM MULTIPLEUNLINKFILEFUNCTION =======================');
    logger.error(err);
    return serviceToController(4, [], 'internal server error');
  }
};

const getDataWithPaginationFunction = async (data) => {
  try {
    const getRecord = await data.Model.findAll({ limit: data.limit, offset: data.offset, order: [data.order] });
    if (getRecord.length === 0) {
      return serviceToController(0, [], 'Data not found');
    } else {
      return serviceToController(1, getRecord, 'Data found Successfully');
    }
  } catch (err) {
    logger.error('======================== ERROR FROM GETDATAFUNCTION =======================');
    logger.error(err);
    return serviceToController(4, [], 'internal server error');
  }
};

const bulkInsertDataFunction = async (data) => {
  try {
    const responseData = [];
    for (let i = 0; i < data.insertData.length; i++) {
      const singleData = data.insertData[i];
      data.callBackReturnData = {};
      const insertRecordFunction = (
        await insertDataFunction({
          Model: data.Model,
          data: { ...singleData, ...data.staticData },
        })
      ).data;
      responseData.push(insertRecordFunction);
    }
    if (responseData.length > 0) {
      return serviceToController(1, responseData, 'Data inserted successfully');
    } else {
      return serviceToController(2, [], 'Data not inserted');
    }
  } catch (error) {
    logger.error('==========ERROR FROM bulkInsertDataFunction SERVICE============');
    logger.error(error);
    return serviceToController(2, [], 'ERROR FROM bulkInsertDataFunction SERVICE CATCH');
  }
};

module.exports = {
  insertDataFunction,
  updateDataFunction,
  deleteDataFunction,
  getDataFunction,
  fileUploadFunction,
  unlinkFileFunction,
  getDataWithPaginationFunction,
  bulkInsertDataFunction,
  checkExistsOrNotFunction,
  findOneSequelizeDataFunction,
};
