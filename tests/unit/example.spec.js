/*
 * @Author: zhangzheng
 * @Date: 2020-08-06 15:12:32
 * @LastEditors: zhangzheng
 * @LastEditTime: 2020-08-06 18:31:15
 * @Descripttion:
 */
import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/header/HeaderTempalte.vue";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    });
    expect(wrapper.text()).to.include(msg);
  });
});
