export const isJsonString = (data: any) => {
  try {
    JSON.parse(data);
  } catch (err) {
    return false;
  }
  return true;
};
export const showImage = (img: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
};
export function boDau(str: string) {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return str.replace(/đ/g, "d").replace(/Đ/g, "D");
}

export const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export const isNumber = (number: number) => {
  try {
    return !isNaN(Number(number)); // isNaN sẽ kiểm tra đầu vào nếu không phải là dạng số sẽ trả ra true
    // và chúng ta đang kiểm tra là số hay không nên để phủ định, nếu là dạng số thì sẽ true
  } catch {
    return false;
  }
};

export const handleCountQuestion = (quiz: any) => {
  if (Array.isArray(quiz)) {
    return quiz.reduce((accumulator, partCurrent) => {
      return accumulator + partCurrent?.questions?.length;
    }, 0);
  }
  return 0;
};

export const shuffleArray = (arr: any[]) => {
  if (!Array.isArray(arr)) return arr;
  const newArr = [...arr];
  // chỉ lặp đến i =1 vì khi arr[0] đảo với arr[0] thì không cần thiết
  for (let i = newArr.length - 1; i > 0; i--) {
    const randomPos = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[randomPos]] = [newArr[randomPos], newArr[i]];
  }
  return newArr;
};
