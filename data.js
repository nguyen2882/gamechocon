/**
 * Kho dữ liệu từ vựng và bài học cho bé 3 tuổi
 * Thiết kế từ ngữ gần gũi, phát âm ngắn gọn, dễ nhớ
 */

const KIDS_DATA = {
    categories: [
        {
            id: 'animals',
            name: 'Động vật',
            nameEn: 'Animals',
            icon: '🐶',
            color: '#FF6B6B',
            bgGradient: 'linear-gradient(135deg, #FF9A8B 0%, #FF6A88 100%)',
            items: [
                { id: 'dog', name: 'Con Chó', nameEn: 'Dog', icon: '🐶', soundKey: 'dog', soundText: 'Gâu gâu!', description: 'Bạn Chó vẫy đuôi mừng bạn nhỏ' },
                { id: 'cat', name: 'Con Mèo', nameEn: 'Cat', icon: '🐱', soundKey: 'cat', soundText: 'Meo meo!', description: 'Bạn Mèo thích cuộn tròn ngủ ngoan' },
                { id: 'duck', name: 'Con Vịt', nameEn: 'Duck', icon: '🦆', soundKey: 'duck', soundText: 'Cạp cạp!', description: 'Bạn Vịt bơi lội dưới ao' },
                { id: 'cow', name: 'Bò Sữa', nameEn: 'Cow', icon: '🐮', soundKey: 'cow', soundText: 'Ùm bò!', description: 'Bạn Bò cho bé sữa thơm mát' },
                { id: 'rooster', name: 'Gà Trống', nameEn: 'Rooster', icon: '🐓', soundKey: 'rooster', soundText: 'Ò ó o!', description: 'Gà Trống gáy vang gọi bé dậy' },
                { id: 'elephant', name: 'Con Voi', nameEn: 'Elephant', icon: '🐘', soundKey: 'elephant', soundText: 'Éccc!', description: 'Bạn Voi có chiếc vòi thật dài' },
                { id: 'monkey', name: 'Con Khỉ', nameEn: 'Monkey', icon: '🐵', soundKey: 'monkey', soundText: 'Khẹc khẹc!', description: 'Bạn Khỉ leo trèo và ăn chuối' },
                { id: 'lion', name: 'Sư Tử', nameEn: 'Lion', icon: '🦁', soundKey: 'lion', soundText: 'Gầm gừ!', description: 'Sư Tử dũng mãnh và đáng yêu' },
                { id: 'pig', name: 'Con Lợn', nameEn: 'Pig', icon: '🐷', soundKey: 'pig', soundText: 'Ủn ỉn!', description: 'Bạn Lợn hồng mũm mĩm' },
                { id: 'rabbit', name: 'Con Thỏ', nameEn: 'Rabbit', icon: '🐰', soundKey: 'rabbit', soundText: 'Nhảy nhót!', description: 'Thỏ trắng có đôi tai dài' }
            ]
        },
        {
            id: 'fruits',
            name: 'Hoa Quả',
            nameEn: 'Fruits',
            icon: '🍎',
            color: '#FF9F43',
            bgGradient: 'linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)',
            items: [
                { id: 'apple', name: 'Quả Táo', nameEn: 'Apple', icon: '🍎', soundKey: 'crunch', soundText: 'Giòn ngọt!', description: 'Táo đỏ ngọt lịm thơm ngon' },
                { id: 'banana', name: 'Quả Chuối', nameEn: 'Banana', icon: '🍌', soundKey: 'sweet', soundText: 'Thơm lừng!', description: 'Chuối vàng ngon ngọt nhiều vitamin' },
                { id: 'watermelon', name: 'Dưa Hấu', nameEn: 'Watermelon', icon: '🍉', soundKey: 'crunch', soundText: 'Mát lành!', description: 'Dưa hấu vỏ xanh ruột đỏ mát' },
                { id: 'strawberry', name: 'Dâu Tây', nameEn: 'Strawberry', icon: '🍓', soundKey: 'sweet', soundText: 'Chua ngọt!', description: 'Dâu tây đỏ mọng chấm bi' },
                { id: 'carrot', name: 'Củ Cà Rốt', nameEn: 'Carrot', icon: '🥕', soundKey: 'crunch', soundText: 'Rôm rốp!', description: 'Cà rốt màu cam bổ cho mắt bé' },
                { id: 'orange', name: 'Quả Cam', nameEn: 'Orange', icon: '🍊', soundKey: 'sweet', soundText: 'Nhiều nước!', description: 'Cam mọng nước giàu vitamin C' },
                { id: 'grape', name: 'Quả Nho', nameEn: 'Grape', icon: '🍇', soundKey: 'sweet', soundText: 'Ngọt ngào!', description: 'Chùm nho tím xinh xắn' }
            ]
        },
        {
            id: 'vehicles',
            name: 'Xe Cộ',
            nameEn: 'Vehicles',
            icon: '🚗',
            color: '#48DBFB',
            bgGradient: 'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',
            items: [
                { id: 'car', name: 'Ô Tô', nameEn: 'Car', icon: '🚗', soundKey: 'car', soundText: 'Bíp bíp!', description: 'Ô tô bon bon chạy trên đường' },
                { id: 'bus', name: 'Xe Buýt', nameEn: 'Bus', icon: '🚌', soundKey: 'bus', soundText: 'Kính coong!', description: 'Xe buýt chở các bạn đến trường' },
                { id: 'airplane', name: 'Máy Bay', nameEn: 'Airplane', icon: '✈️', soundKey: 'airplane', soundText: 'Vù vù!', description: 'Máy bay bay vút trên bầu trời xanh' },
                { id: 'train', name: 'Tàu Hỏa', nameEn: 'Train', icon: '🚂', soundKey: 'train', soundText: 'Xình xịch!', description: 'Tàu hỏa chạy dài xình xịch' },
                { id: 'boat', name: 'Thuyền Buồm', nameEn: 'Boat', icon: '⛵', soundKey: 'boat', soundText: 'Tủm tỉm!', description: 'Thuyền buồm lướt sóng ra khơi' },
                { id: 'bicycle', name: 'Xe Đạp', nameEn: 'Bicycle', icon: '🚲', soundKey: 'bicycle', soundText: 'Kính coong!', description: 'Xe đạp bé tập thể dục hàng ngày' },
                { id: 'helicopter', name: 'Trực Thăng', nameEn: 'Helicopter', icon: '🚁', soundKey: 'helicopter', soundText: 'Phành phạch!', description: 'Trực thăng có cánh quạt quay tít' }
            ]
        },
        {
            id: 'shapes',
            name: 'Hình & Màu',
            nameEn: 'Shapes & Colors',
            icon: '🎨',
            color: '#1DD1A1',
            bgGradient: 'linear-gradient(135deg, #108dc7 0%, #ef8e38 100%)',
            items: [
                { id: 'circle_red', name: 'Hình Tròn Đỏ', nameEn: 'Red Circle', icon: '🔴', soundKey: 'shape', soundText: 'Tròn vo!', description: 'Hình tròn quay tròn lăn tăn' },
                { id: 'square_blue', name: 'Hình Vuông Xanh', nameEn: 'Blue Square', icon: '🟦', soundKey: 'shape', soundText: 'Bốn cạnh đều!', description: 'Hình vuông có 4 góc vuông vắn' },
                { id: 'triangle_green', name: 'Tam Giác Xanh Lá', nameEn: 'Green Triangle', icon: '🔺', soundKey: 'shape', soundText: 'Ba góc nhọn!', description: 'Hình tam giác giống ngọn núi' },
                { id: 'star_yellow', name: 'Ngôi Sao Vàng', nameEn: 'Yellow Star', icon: '⭐', soundKey: 'star', soundText: 'Lấp lánh!', description: 'Ngôi sao vàng lấp lánh trên cao' },
                { id: 'heart_pink', name: 'Trái Tim Hồng', nameEn: 'Pink Heart', icon: '💖', soundKey: 'heart', soundText: 'Yêu thương!', description: 'Trái tim yêu mẹ yêu ba' },
                { id: 'diamond_orange', name: 'Hình Thoi Cam', nameEn: 'Orange Diamond', icon: '🔶', soundKey: 'shape', soundText: 'Lấp lánh!', description: 'Hình thoi như cánh diều bay' }
            ]
        }
    ],

    // Bộ nhãn dán sticker thưởng cho bé khi làm đúng nhiều câu
    stickers: [
        { id: 'stk_star', name: 'Bé Chăm Chỉ', icon: '⭐', unlocked: true },
        { id: 'stk_crown', name: 'Bé Tài Năng', icon: '👑', unlocked: false, requireStars: 5 },
        { id: 'stk_trophy', name: 'Bé Thông Minh', icon: '🏆', unlocked: false, requireStars: 10 },
        { id: 'stk_medal', name: 'Bé Phát Âm Giỏi', icon: '🎖️', unlocked: false, requireStars: 15 },
        { id: 'stk_rocket', name: 'Nhà Thám Hiểm Nhí', icon: '🚀', unlocked: false, requireStars: 20 },
        { id: 'stk_rainbow', name: 'Cầu Vồng Tươi Sáng', icon: '🌈', unlocked: false, requireStars: 25 },
        { id: 'stk_unicorn', name: 'Kỳ Lân May Mắn', icon: '🦄', unlocked: false, requireStars: 30 }
    ],

    // Lời khen thưởng động viên bé (Random sau mỗi câu đúng)
    praisePhrases: [
        'Bé giỏi quá!',
        'Hoan hô bé yêu!',
        'Tuyệt vời ông mặt trời!',
        'Bé phát âm chuẩn lắm!',
        'Chính xác rồi, hoan hô!',
        'Bé thông minh quá chừng!'
    ],

    praisePhrasesEn: [
        'Awesome job!',
        'You are so smart!',
        'Super star!',
        'Great job!',
        'Hooray!'
    ]
};
