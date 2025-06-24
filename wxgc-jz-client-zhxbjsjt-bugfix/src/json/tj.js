/**
 * 塔机报警判断  0 碰撞；1 重量；2 力矩；3 倾斜；4 风速；5 幅度限位；6 高度限位；7 回转限位）
 * @param state
 * @returns {string}
 */
export function getAlermReason(state) {
  let Str;
  switch (state) {
    case 0:
      Str = "碰撞"
      break;
    case 1:
      Str = "重量"
      break;
    case 2:
      Str = "力矩"
      break;
    case 3:
      Str = "倾斜"
      break;
    case 4:
      Str = "风速"
      break;
    case 5:
      Str = "幅度限位"
      break;
    case 6:
      Str = "高度限位"
      break;
    case 7:
      Str = "回转限位"
      break;

    default:
      Str = "正常"
  }
  return Str
}
