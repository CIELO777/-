import store from '../store/index'

export default function setTitle(data) {
	if (data.includes('Home')) {
		store.commit('saveTitle', { title: '客户管理', leftShow: false, tabarShow: true });
	} else if (data.includes('LinkDetailed')) {
		store.commit('saveTitle', { title: '联系人详情', leftShow: true });
	} else if (data.includes('OrderDetail')) {
		store.commit('saveTitle', { title: '新增订单', leftShow: true });
	} else if (data.includes('ChooseCommodity')) {
		store.commit('saveTitle', { title: '已选择详情页', leftShow: true });
	} else if (data.includes('OrderList')) {
		store.commit('saveTitle', { title: '选择所属者', leftShow: true });
	} else if (data.includes('Agendadetail')) {
		store.commit('saveTitle', { title: '添加日程', leftShow: true });
	} else if (data.includes('Checking')) {
		store.commit('saveTitle', { title: '客户查重', leftShow: false, tabarShow: true });
	} else if (data.includes('HighSeas')) {
		store.commit('saveTitle', { title: '客户管理', leftShow: false, tabarShow: true });
	} else if (data.includes('Common')) {
		store.commit('saveTitle', { title: '客户管理', leftShow: false, tabarShow: true });
	} else if (data.includes('SheetImg')) {
		store.commit('saveTitle', { title: '添加图文', leftShow: true, tabarShow: false });
	}
	
}