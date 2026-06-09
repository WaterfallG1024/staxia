import { differenceInDays, parseISO, startOfDay } from "date-fns";

/**
 * 期限から重要度を計算する（1〜10のスケール）
 * @param {string} deadline - ISO 8601 形式の日付文字列 (YYYY-MM-DD)
 * @returns {number} 重要度 (1: 低 〜 10: 高)
 */
export function calculateImportance(deadline) {
  if (!deadline) return 1;

  const today = startOfDay(new Date());
  const targetDate = startOfDay(parseISO(deadline));
  
  // 日付の差分（今日が0、明日が1）
  const diffDays = differenceInDays(targetDate, today);

  if (diffDays <= 0) {
    // 期限切れ、または今日が期限の場合は最大重要度
    return 10;
  } else if (diffDays >= 10) {
    // 10日以上先なら最低重要度
    return 1;
  } else {
    // それ以外は線形に計算 (10日先が1, 明日が9)
    return 11 - diffDays;
  }
}
