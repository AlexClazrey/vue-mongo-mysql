import { mount } from '@vue/test-utils'
import APT from '@/components/admin-panel/AdminPanelTable.vue'

describe("AdminPanelTable.vue", () => {
	it("renders loading", () => {
		const wrapper = mount(APT, {
			propsData: {
				caption: "CAP",
				names: ['Col 1', 'Col 2', 'Col </div>'],
				properties: ['x', 'y', '@z'],
				data: [
					{x: '123', "y": 456, '@z': null},
					{x: 789, 'y': 1011, "@z": undefined},
				],
				loading: false,
				note: "Column 3 is a test column.",
				showButton: false,
			}
		});
		expect(wrapper.find('td').text()).toBe('123');
	});
});
