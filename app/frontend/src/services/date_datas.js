import {HttpService} from '~/services/base_service';
import {formatDate} from '~/components/Calendar/components/utils';


/** DateStatus service for requesting date statuses. */
class DateStatusService_ extends HttpService {
  /**
   * Get all the missing reasons from the server.
   * @return {Promise<T>}
   */
  async getReasons() {
    return await this.request({
      method: 'get',
      url: '/reasons',
    });
  }

  /**
   * Add new date datas to the server.
   * @param {number} start - start timestamp
   * @param {number} end - end timestamp
   * @param {number} userId - relevant user id.
   * @param {string} state - the date status (here/not_here).
   * @param {string} reason - the reason if not here.
   * @return {Promise<T>}
   */
  async addDateData({userId, state, start, end=undefined, reason=null}) {
    return await this.request({
      method: 'post',
      url: '/',
      data: {
        start_date: start,
        end_date: end,
        user_id: userId,
        state,
        reason,
      },
    });
  }

  /**
   * Set today status.
   * @param {number} userId - relevant user id.
   * @param {string} state - the date status (here/not_here).
   * @param {string} reason - the reason if not here.
   * @return {Promise<T>}
   */
  async setToday({userId, state, reason=null}) {
    const date = new Date();
    return await this.request({
      method: 'post',
      url: '/',
      data: {
        start_date: formatDate(date),
        user_id: userId,
        state,
        reason,
      },
    });
  }

  /**
   * Delete date status.
   * @param {number} userId - relevant user id.
   * @param {date} date - date to delete.
   * @return {Promise<T>}
   */
  async deleteDate({userId, date}) {
    return await this.request({
      method: 'delete',
      url: '/',
      data: {
        start_date: formatDate(date),
        user_id: userId,
      },
    });
  }
  /**
   * Get date datas from server.
   * @param {number} start - start timestamp
   * @param {number} end - end timestamp
   * @param {number} usersId - relevant users id.
   * @return {Promise<T>}
   */
  async getDateData({start, end, usersId}) {
    return await this.request({
      method: 'get',
      url: '/',
      params: {
        start,
        end,
        users_id: usersId,
      },
    });
    // return Promise.resolve(statusList);
  }
}

export const DateStatusService = new DateStatusService_('/api/v1/dates_status');
export default DateStatusService;
