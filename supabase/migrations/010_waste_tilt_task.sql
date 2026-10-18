-- 課題IDを維持し、既存の完了状況・ポイント・パスワードを引き継ぐ。
update public.map_tasks
set title = '倒れたごみ箱のお知らせ'
where id = 'l1-earthquake';
