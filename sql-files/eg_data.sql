use bforum;

drop table if exists _test;
create temporary table _test ( id int not null primary key auto_increment, res varchar(30) not null, title varchar(30));

-- set @debug = 1;

call add_board('Board 1', @bid);
call add_board('Board 2', @bid2);

call user_register('cat', 'A CAT', '123456', 'ddddeee', 'cat@cat.com', @uid);
call user_register('dog', 'A DOG', '123456', 'ddddeee', 'dog@dog.com', @uid2);
call user_register('cat', 'A CAT', '123456', 'ddddeee', 'cat@cat.com', @uid3);
insert into _test(res) values (if(@uid3 = -1, 'pass', 'fail'));
call user_register('ct', 'A CA', '1256', 'ddeee', 'cat@cat.com', @uid3);
insert into _test(res) values (if(@uid3 = -1, 'pass', 'fail'));
call user_register('cat', 'A CAT', '123456', 'ddddeee', 'c@cat.com', @uid3);
insert into _test(res) values (if(@uid3 = -1, 'pass', 'fail'));

call check_privilege(@uid2, @bid, 'commit post', @res);
insert into _test(res) values (if(@res is null, 'pass', 'fail'));

call add_user_to_group(@uid, @gid, @bid);
call add_user_to_group(@uid2, @gid, @bid);

call add_post('hi', 'hello', @pid);
call add_post_to_board(@pid, @bid);
call commit_post(@uid, @pid);

call edit_post(@pid, 'hihi', 'hello hello');

call add_post('good day', 'day good', @pid2);
call add_post_to_board(@pid2, @bid);
call commit_post(@uid2, @pid2);

select max(pid) from v_ubp_list into @res;
insert into _test(res) values (if(@res = 2, 'pass', 'fail'));
call add_post('good draft', 'draft good', @pid3);
set @pcid = (select `post_content_id` from post where `id` = @pid3);
call add_post_to_board(@pid3, @bid2);
call draft_post(@uid, @pid3, @pcid);
select max(pid) from v_ubp_list into @res;
insert into _test(res) values (if(@res = 2, 'pass', 'fail'));
call edit_draft(@uid, @pid3, 'godd draft edited', 'draft good edited');
call commit_post(@uid, @pid3);
select max(pid) from v_ubp_list into @res;
insert into _test(res) values (if(@res = 3, 'pass', 'fail'));


call add_post('good reply', 'reply good', @pid4);
call add_post_to_reply(@pid4, @pid2, @res);
insert into _test(res) values (if(@res = 1, 'pass', 'fail'));
call add_post_to_reply(@pid4, @pid4, @res);
insert into _test(res) values (if(@res = 0, 'pass', 'fail'));
call commit_post(@uid2, @pid4);
select max(pid) from v_ubp_list into @res;
insert into _test(res) values (if(@res = 3, 'pass', 'fail'));


call get_post_board(@pid, @res);
insert into _test(res) values (if(@res = 1, 'pass', 'fail'));
call get_post_board(@pid2, @res);
insert into _test(res) values (if(@res = 1, 'pass', 'fail'));
call get_post_board(@pid3, @res);
insert into _test(res) values (if(@res = 2, 'pass', 'fail'));
call get_post_board(@pid4, @res);
insert into _test(res) values (if(@res = 1, 'pass', 'fail'));

call check_privilege(@uid2, @bid, 'commit post', @res);
insert into _test(res) values (if(@res = 1, 'pass', 'fail'));
call add_user_to_group(@uid2, @gid2, @bid);
call check_privilege(@uid2, @bid, 'commit post', @res);
insert into _test(res) values (if(@res = 0, 'pass', 'fail'));

call user_login('dog', '123456', @res);
insert into _test(res) values (if(@res = 2, 'pass', 'fail'));
call user_login('dog', '124536', @res);
insert into _test(res) values (if(@res is null, 'pass', 'fail'));
call user_login('cat', '123456', @res);
insert into _test(res) values (if(@res = 1, 'pass', 'fail'));

call add_cookies(@uid, '10.10.10.10', 'cookies a');
call check_cookies(@uid, 'cookies a', @res);
insert into _test(res) values (if(@res = 1, 'pass', 'fail'));
call check_cookies(@uid, 'cookies b', @res);
insert into _test(res) values (if(@res = 0, 'pass', 'fail'));
call check_cookies(@uid2, 'cookies b', @res);
insert into _test(res) values (if(@res = 0, 'pass', 'fail'));
call check_cookies(@uid2, 'cookies a', @res);
insert into _test(res) values (if(@res = 0, 'pass', 'fail'));
call update_cookies(@uid, 'cookies a', @res);
insert into _test(res) values (if(@res = 1, 'pass', 'fail'));
call check_cookies(@uid, 'cookies b', @res);
insert into _test(res) values (if(@res = 0, 'pass', 'fail'));
call check_cookies(@uid2, 'cookies b', @res);
insert into _test(res) values (if(@res = 0, 'pass', 'fail'));
call check_cookies(@uid2, 'cookies a', @res);
insert into _test(res) values (if(@res = 0, 'pass', 'fail'));
call delete_cookies('cookies a');
call check_cookies(@uid, 'cookies a', @res);
insert into _test(res) values (if(@res = 0, 'pass', 'fail'));

 -- three routes tested
call save_draft(@uid, null, 'new draft 1', 'new draft content 1', @pid5);
call add_post_to_board(@pid5, @bid2);
call commit_post(@uid, @pid5);
select max(pid) from v_ubp_list into @res;
insert into _test(res) values (if(@res = 5, 'pass', 'fail'));
call save_draft(@uid2, @pid2, 'new draft 2', 'new draft content 2', @pid6);
call commit_post(@uid2, @pid6);
select max(pid) from v_ubp_list into @res;
insert into _test(res) values (if(@res = 5, 'pass', 'fail'));
call save_draft(@uid, null, 'new draft 3', 'new draft content 3', @pid7);
call save_draft(@uid, @pid7, 'new draft 3 a ', 'new draft content 3 a ', @pid7);
call save_draft(@uid, @pid7, 'new draft 3 b ', 'new draft content 3 b ', @pid7);
call add_post_to_board(@pid7, @bid2);
call save_draft(@uid, @pid7, 'new draft 3 c ', 'new draft content 3 c ', @pid7);
call commit_post(@uid, @pid7);
select max(pid) from v_ubp_list into @res;
insert into _test(res) values (if(@res = 6, 'pass', 'fail'));

set @debug = 0;

select * from _test;

drop table _test;