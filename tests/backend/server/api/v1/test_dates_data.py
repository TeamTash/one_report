""""Tests fot dates_data router."""
from http.client import OK
from datetime import date, datetime

from freezegun import freeze_time

from db import models
from db.crud.date_datas import set_new_date_data, get_dates_data
from tests.backend.test_query import TestQuery
from tests.backend.utils.url_utils import URL, Query
from tests.backend.utils.fake_users_generator import get_fake_user
from tests.backend.utils.snapshot import response_snapshot


@freeze_time("2020-01-01")
class TestDatesStatus(TestQuery):
    """Tests fot dates_data router."""
    START_DATE = date(1997, 1, 3)
    END_DATE = date(1997, 1, 4)
    REPORTED_TIME = datetime(1997, 1, 3, 12, 12, 12)

    def set_up_fake_db(self):
        # Create Madors:
        group = models.Mador(name='Group')
        group_settings = models.MadorSettings(
            mador=group, key='default_reminder_time', value='09:00',
            type='time')
        self.session.add_all([group_settings, group])

        # Creat Permissions:
        commander_permission = models.Permission(type="commander")
        user_permission = models.Permission(type="user")
        self.session.add_all([commander_permission, user_permission])
        self.session.commit()

        self.user = get_fake_user()
        self.user.permissions = [user_permission]

        self.current_user.permissions = [user_permission, commander_permission]
        self.current_user.soldiers = [self.user]

        group.assign_mador_for_users([self.user, self.current_user])

        self.session.add(self.user)
        self.session.commit()

        set_new_date_data(
            db=self.session,
            user_id=self.user.id,
            state=self.state_here,
            reported_by_id=self.current_user.id,
            reported_time=self.REPORTED_TIME,
            start_date=self.START_DATE,
            end_date=self.END_DATE
        )

    def test_get_dates_status(self):
        """"Test for get_dates_status from dates_status router."""
        query = Query(
            start=self.START_DATE,
            end=self.END_DATE,
            users_id=[self.user.id]
        )
        url = URL(url='/dates_status/', query=query)
        response = self.API_V1_TEST.get(
            url.to_text(),
            headers={'authorization': f'bearer {self.current_user_token}'}
        )
        self.assertEqual(response.status_code, OK)
        self.assertTrue(response_snapshot(0, response.json()))

    def test_post_dates_status(self):
        """"Test for post_dates_status from dates_status router."""
        new_date = date(1999, 1, 5)
        url = URL('/dates_status/')
        response = self.API_V1_TEST.post(
            url.to_text(),
            headers={'authorization': f'bearer {self.current_user_token}'},
            json={
                'user_id': self.user.id,
                'start_date': str(new_date),
                'state': self.state_not_here.name,
                'reason': self.reasons["1_abc"]
            }
        )

        self.assertEqual(response.status_code, OK)
        self.assertTrue(response_snapshot(0, response.json()))

    def test_delete_dates_status(self):
        """"Test for delete_dates_status from dates_status router."""
        url = URL('/dates_status/')
        response = self.API_V1_TEST.delete(
            url.to_text(),
            json={
                "start_date": str(self.START_DATE),
                "end_date": str(self.END_DATE),
                "user_id": self.user.id
            },
            headers={'authorization': f'bearer {self.current_user_token}'}
        )

        assert response.status_code == OK

        #  assert that the data was acctually deleted from the db.
        date_data = get_dates_data(
            db=self.session,
            user_id=self.user.id,
            start_date=self.START_DATE,
            end_date=self.END_DATE
        )
        self.assertEqual(date_data, [])

    def test_put_dates_status(self):
        """"Test for put_dates_status from dates_status router."""
        url = URL('/dates_status/')
        response = self.API_V1_TEST.post(
            url.to_text(),
            headers={'authorization': f'bearer {self.current_user_token}'},
            json={
                'user_id': self.user.id,
                'start_date': str(self.START_DATE),
                'state': self.state_not_here.name,
                'reason': self.reasons["1_abc"],
            }
        )

        self.assertEqual(response.status_code, OK)
        self.assertTrue(response_snapshot(0, response.json()))

    def test_get_reasons(self):
        """"Test for get_reasons from dates_status router."""
        url = URL('/dates_status/reasons')
        response = self.API_V1_TEST.get(
            url.to_text(),
            headers={'authorization': f'bearer {self.current_user_token}'}
        )

        self.assertEqual(response.status_code, OK)
        self.assertTrue(response_snapshot(0, response.json()))
