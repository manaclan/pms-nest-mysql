if exists (select 1 from rooms_bookings where roomId=201)
begin
  update rooms
  set status = 'CHECKIN'
  where id = 201;
end