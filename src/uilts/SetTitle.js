import store from '../store/index'

export default function setTitle(data) {
	if (data.includes('Home')) {
		store.commit('saveTitle', { title: '客户管理', leftShow: false, tabarShow: true });
	} else if (data.includes('LinkDetailed')) {
		store.commit('saveTitle', { title: '联系人详情', leftShow: true });
	} else if (data.includes('OrderDetail')) {
		store.commit('saveTitle', { title: '新增订单', leftShow: true });
	} else if (data.includes('ChooseCommodity')) {
		store.commit('saveTitle', { title: '未选择详情页', leftShow: true });
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
	} else if (data.includes('Addcustomer')) {
		store.commit('saveTitle', { title: '添加联系人', leftShow: true, tabarShow: false });
	} else if (data.includes('detailFilter')) {
		store.commit('saveTitle', { title: '筛选客户', leftShow: true, tabarShow: false });
	} else if (data.includes('Addcustomer')) {
		store.commit('saveTitle', { title: '公司信息', leftShow: true, tabarShow: false });
	} else if (data.includes('Navigation')) {
		store.commit('saveTitle', { title: '乐语', leftShow: false, tabarShow: false });
	}else if (data.includes('Card')) {
		store.commit('saveTitle', { title: '企业名片', leftShow: false, tabarShow: false });
	}else if (data.includes('Video')) {
		store.commit('saveTitle', { title: '视频', leftShow: false, tabarShow: false });
	}else if (data.includes('ColorPage')) {
		store.commit('saveTitle', { title: '全部彩页', leftShow: false, tabarShow: false });
	}
}