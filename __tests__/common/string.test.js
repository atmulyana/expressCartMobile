/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import {str} from '../../common/string';

test('str', () => {
    expect(str('Mulai dari $1, $2 dan $4 dst.', 'satu', 'dua', 'kosong', 'tiga')).toBe('Mulai dari satu, dua dan tiga dst.');
    expect(str('Mulai dari $1, $2 dan $3 dst.', 0, 1, 2)).toBe('Mulai dari 0, 1 dan 2 dst.');
    expect(str('Mulai dari $1, $2 dan $3 dst.', null, 1, 2)).toBe('Mulai dari , 1 dan 2 dst.');
    expect(str('Mulai dari $1, $2 dan $3 dst.', 'satu', 'dua')).toBe('Mulai dari satu, dua dan  dst.');
});