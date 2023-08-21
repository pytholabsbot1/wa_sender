import openai
openai.api_key = "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"

c_ = """
Airport Enclave is the most Luxurious and Premium real estate project located in Western Odisha, close to the Veer Surendra Sai Airport in Jharsuguda. Our project offers 1, 2, 3, 4, and 5 BHK Flats & Duplex Villas, designed to cater to the needs of families, professionals, and investors who are looking for a comfortable and luxurious lifestyle.
Spread over 10 acres of green and serene environment, this project is surrounded by an Eco Park and the IB River, providing its residents with peace, tranquility, and a connection to nature. The project is designed to be eco-friendly and sustainable, with energy-efficient systems and built with sustainable materials to reduce its carbon footprint. This makes it an ideal place for those who are looking for an environment-friendly lifestyle.
The project is equipped with all the amenities one could need, including a Club House, Gym, Swimming Pool, Restaurant, Basketball Court, Tennis Court, Wide Roads, Nature Park with jogging track, and much more. The idea behind this mega project is to inspire a healthy lifestyle by creating dream spaces for the residents far away from the hectic and mundane life.

Current price of the units :
1BHK STUDIO APARTMENT - 25 LACS
2BHK FLAT - 48 LACS
3BHK FLAT - 63.6 LACS
4BHK DUPLEX - 1 CR 20 LACS

Few important points about the project :
* we only sell constructed units
* Finance can be availed from major banks like SBI , HDFC, LIC HFL & the whole funding process is handled by our finance team

Must follow Instructions :
* reply to clients should be pollite & short
* always answer in english
"""

openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
        {"role": "system", "content": f"You are a helpful assistant who solves clients queries based on the following context : {c_}"},
        {"role": "user", "content": "fuck you betichodh"},
    ]
)
