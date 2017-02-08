import Vue from 'vue';
import VueResource from '../lib/vue-resource';

Vue.use(VueResource);

export default function resource(model) {
  const modelUnderscore = model.replace(
    /([A-Z])/g,
    $1 => `_${$1.toLowerCase()}`
  ).replace(/^_/, '');
  return Vue.resource(`${modelUnderscore}{/id}{/action}/`);
}

// 导出所有的 resource
// export const AccountTransaction = Vue.resource('account_transaction{/id}{/action}/');
// export const Article = Vue.resource('article{/id}{/action}/');
// export const Advert = Vue.resource('advert{/id}{/action}/');
// export const AdvertCreditTransaction = Vue.resource('advert_credit_transaction{/id}{/action}/');
// export const AdvertRechargeRecord = Vue.resource('advert_recharge_record{/id}{/action}/');
// export const AdvertSlot = Vue.resource('advert_slot{/id}{/action}/');
// export const AdvertUnit = Vue.resource('advert_unit{/id}{/action}/');
// export const Bank = Vue.resource('bank{/id}{/action}/');
// export const BankAccount = Vue.resource('bank_account{/id}{/action}/');
// export const Comment = Vue.resource('comment{/id}{/action}/');
// export const Contact = Vue.resource('contact{/id}{/action}/');
// export const Customer = Vue.resource('customer{/id}{/action}/');
// export const CustomerAddress = Vue.resource('customer_address{/id}{/action}/');
// export const Demand = Vue.resource('demand{/id}{/action}/');
// export const DeliveryCompany = Vue.resource('delivery_company{/id}{/action}/');
// export const DeliveryRecord = Vue.resource('delivery_record{/id}{/action}/');
// export const EntityStoreValidation = Vue.resource('entity_store_validation{/id}{/action}/');
// export const Goods = Vue.resource('goods{/id}{/action}/');
// export const GoodsAlternationLog = Vue.resource('goods_alternation_log{/id}{/action}/');
// export const GoodsViewLog = Vue.resource('goods_view_log{/id}{/action}/');
// export const Image = Vue.resource('image{/id}{/action}/');
// export const Inform = Vue.resource('inform{/id}{/action}/');
// export const InstitutionValidation = Vue.resource('institution_validation{/id}{/action}/');
// export const Keyword = Vue.resource('keyword{/id}{/action}/');
// export const Leaflet = Vue.resource('leaflet{/id}{/action}/');
// export const Message = Vue.resource('message{/id}{/action}/');
// export const MessageTemplate = Vue.resource('message_template{/id}{/action}/');
// export const Option = Vue.resource('option{/id}{/action}/');
// export const Order = Vue.resource('order{/id}{/action}/');
// export const OrderReturnSheet = Vue.resource('order_return_sheet{/id}{/action}/');
// export const PaymentRecord = Vue.resource('payment_record{/id}{/action}/');
// export const PersonalValidation = Vue.resource('personal_validation{/id}{/action}/');
// export const Rating = Vue.resource('rating{/id}{/action}/');
// export const RechargeRecord = Vue.resource('recharge_record{/id}{/action}/');
// export const Shop = Vue.resource('shop{/id}{/action}/');
// export const ShoppingCartRecord = Vue.resource('shopping_cart_record{/id}{/action}/');
// export const SocialArticle = Vue.resource('social_article{/id}{/action}/');
// export const Tag = Vue.resource('tag{/id}{/action}/');
// export const Urgency = Vue.resource('urgency{/id}{/action}/');
// export const User = Vue.resource('user{/id}{/action}/');
// export const UserPreference = Vue.resource('user_preference{/id}{/action}/');
// export const WithdrawRecord = Vue.resource('withdraw_record{/id}{/action}/');

