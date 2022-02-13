/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import './encrypted-storage-mock';
import './localize-mock';
import './sqlite-mock';

jest.mock('../../common/server', () => ({
    __esModule: true,
    serverUrl: url => url,
    callServer: () => Promise.resolve({}),
}));